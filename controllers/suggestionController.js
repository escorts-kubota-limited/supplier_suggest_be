import models from "../models/index.js";
import { Op } from "sequelize";
import admin from "../notification/firebase_config.js";
import Excel from "excel4node";
import path from "path";
import {suggestionTemplate} from '../suggestionTemplate.js'
import { sendSuggestionCreationMail } from "../mail/mailController.js";
import { convertHtmlToPdf, outputPath } from "../middleware/generatePDF.js";

const { Suggestion, SuggestionStatus, Departments, User, Device, Messages } =
  models;

export const createSuggestion = async (req, res) => {
  try {
    const {
      supplier_name,
      supplier_representative,
      designation,
      buyer_name,
      submitted_by,
      buyer_email,
      department,
      improvement_category,
      idea,
      ekl_part_name,
      ekl_part_description,
      benefit,
      change_points,
      before_implementation,
      after_implementation,
      benefit_after_implementation,
    } = req.body;

    // Check for file attachments
    const files = req.files || []; // Assuming files come in req.files
    const attachments = files.map((file) => file.location); // Extract file paths

    // Validate max file upload limit
    if (attachments.length > 5) {
      return res
        .status(400)
        .json({ error: "Maximum of 5 files can be uploaded" });
    }

    // Create the suggestion
    const suggestion = await Suggestion.create({
      supplier_name,
      supplier_representative,
      designation,
      buyer_name,
      buyer_email,
      department,
      improvement_category,
      idea,
      ekl_part_name,
      submitted_by,
      ekl_part_description,
      benefit,
      change_points,
      before_implementation,
      after_implementation,
      benefit_after_implementation,
      attachments,
    });

    await SuggestionStatus.create({
      suggestion_id: suggestion.id,
      status: "in review", // Default status
    });

    sendSuggestionCreationMail(buyer_email, buyer_name);

    res.status(201).json({
      status: true,
      message: "Suggestion created successfully",
      suggestion,
    });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestionByPhone = async (req, res) => {
  try {
    const { id } = req.body; // Extract the user ID
    const { page = 1, limit = 10 } = req.query; // Extract page and limit with defaults

    // Calculate the offset
    const offset = (page - 1) * limit;

    // Query the database with pagination
    const suggestions = await Suggestion.findAndCountAll({
      where: {
        submitted_by: id,
      },
      attributes: [
        "id",
        "supplier_name",
        "supplier_representative",
        "designation",
        "createdAt",
      ],
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      order: [["createdAt", "DESC"]], // Optional: order by creation date
    });

    res.status(200).json({
      status: true,
      data: suggestions.rows, // The actual suggestions

      totalRecords: suggestions.count, // Total number of matching records
      totalPages: Math.ceil(suggestions.count / limit), // Total pages
      currentPage: parseInt(page, 10), // Current page
    });
  } catch (e) {
    console.error("Error getting suggestion:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllSuggestion = async (req, res) => {
  try {
    const { page = 1, limit = 10, date } = req.query; // Extract page and limit with defaults
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const queryDate = date || currentDate;
    // Calculate the offset
    const offset = (page - 1) * limit;

    // Query the database with pagination
    const suggestions = await Suggestion.findAndCountAll({
      attributes: [
        "id",
        "supplier_name",
        "supplier_representative",
        "designation",
        "createdAt",
      ],
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      where: {
        createdAt: {
          [Op.gte]: new Date(queryDate),
          [Op.lt]: new Date(
            new Date(queryDate).setDate(new Date(queryDate).getDate() + 1)
          ),
        },
      },
      order: [["createdAt", "DESC"]], // Optional: order by creation date
    });

    const all_suggestion = await Suggestion.findAll({
      attributes: ["id", "createdAt"],
    });

    var dates = [];

    all_suggestion?.forEach((e) => {
      dates.push(
        `${new Date(e.dataValues.createdAt)
          .getDate()
          .toString()
          .padStart(2, 0)}/${(new Date(e.dataValues.createdAt).getMonth() + 1)
          .toString()
          .padStart(2, 0)}/${new Date(e.dataValues.createdAt).getFullYear()}`
      );
    });

    res.status(200).json({
      status: true,
      dates: dates.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      }),
      data: suggestions.rows, // The actual suggestions
      totalRecords: suggestions.count, // Total number of matching records
      totalPages: Math.ceil(suggestions.count / limit), // Total pages
      currentPage: parseInt(page, 10), // Current page
    });
  } catch (e) {
    console.error("Error getting suggestion:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestionDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const suggestion = await Suggestion.findOne({
      where: {
        id: id,
      },
    });
    res.status(201).json({
      status: true,
      data: suggestion,
    });
  } catch (e) {
    console.error("Error getting suggestion:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const downloadSuggestion = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(req.query);
    
    const suggestion = await Suggestion.findOne({
      where: {
        id: id,
      },
    });
    convertHtmlToPdf(suggestionTemplate, suggestion.dataValues, outputPath(String(id)))
      .then((pdfPath) => {

          res.download(path.resolve(`./uploads/${id}/suggestion.pdf`), function (err) {
              if (err) {
                console.error("Error sending file:", err);
              } else {
                console.log("Sent:");
              }
            });
        // res.status(201).json({
        //   url: pdfPath,
        //   status: true,
        //   path: `/uploads/${id}/suggestion.pdf`,
        //   message: "Suggestion Exported Successfully",
        // });
      })
      .catch((error) => {
        console.log(error);
        
        res.status(201).json({
          status: false,
          message: "Error Exporting File",
          error: error,
        });
      });
  } catch (e) {
    console.error("Error getting suggestion:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Departments.findAll();
    res.status(201).json({
      status: true,
      data: departments,
    });
  } catch (e) {
    console.error("Error getting Departments:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBuyers = async (req, res) => {
  try {
    const buyers = await User.findAll({
      attributes: ["email", "name", "id"],
      where: {
        usertype: 1,
      },
    });
    res.status(201).json({
      status: true,
      data: buyers,
    });
  } catch (e) {
    console.error("Error getting Buyers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestionsByEmail = async (req, res) => {
  try {
    const { email } = req.body; // Extract department_id from the request body
    const { page = 1, limit = 10, date } = req.query; // Extract page and limit from query params, with defaults
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const queryDate = date || currentDate;

    // Calculate the offset
    const offset = (page - 1) * limit;

    // Query the database with pagination
    const suggestions = await Suggestion.findAndCountAll({
      where: {
        buyer_email: email, // Filter by mail
        createdAt: {
          [Op.gte]: new Date(queryDate),
          [Op.lt]: new Date(
            new Date(queryDate).setDate(new Date(queryDate).getDate() + 1)
          ),
        },
      },
      attributes: [
        "id",
        "supplier_name",
        "supplier_representative",
        "buyer_email",
        "designation",
        "createdAt",
      ],

      offset: parseInt(offset, 10), // Pagination offset
      limit: parseInt(limit, 10), // Pagination limit
      order: [["createdAt", "DESC"]], // Optional: order results by creation date
    });

    var dates = [];

    const totalSuggestionsByEmail = await Suggestion.findAll({
      where: {
        buyer_email: email,
      },
      attributes: ["id", "createdAt"],
    });

    totalSuggestionsByEmail?.forEach((e) => {
      dates.push(
        `${new Date(e.dataValues.createdAt)
          .getDate()
          .toString()
          .padStart(2, 0)}/${(new Date(e.dataValues.createdAt).getMonth() + 1)
          .toString()
          .padStart(2, 0)}/${new Date(e.dataValues.createdAt).getFullYear()}`
      );
    });

    // Respond with paginated data and metadata
    res.status(200).json({
      status: true,
      dates: dates.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      }),
      data: suggestions.rows, // The actual suggestions
      totalRecords: suggestions.count, // Total number of matching records
      totalPages: Math.ceil(suggestions.count / limit), // Total pages
      currentPage: parseInt(page, 10), // Current page
    });
  } catch (e) {
    console.error("Error fetching suggestions by department:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id, department_id } = req.body;

    // Validate input
    if (!id || !department_id) {
      return res.status(400).json({
        status: false,
        message: "Both 'id' and 'department_id' are required.",
      });
    }

    // Find the record by ID and update department_id
    const [updatedRowsCount] = await Suggestion.update(
      { department: department_id },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        status: false,
        message: "No record found with the provided ID.",
      });
    }

    const department = await Departments.findOne({
      where: {
        department_id: department_id,
      },
    });

    const suggestion = await Suggestion.findOne({
      where: {
        id: id,
      },
    });

    const user = await User.findOne({
      where: {
        id: suggestion.dataValues.submitted_by,
      },
    });

    const device = await Device.findOne({
      where: {
        phone_number: user.dataValues.phone_number,
      },
    });

    const message = {
      token: device.dataValues.firebase_token,
      data: {
        title: "Department Updated",
        body: `your suggestion has been sent to ${department.dataValues.label}`,
      },
      android: {
        notification: {
          title: "Department Updated",
          body: `your suggestion has been sent to ${department.dataValues.label}`,
          sound: "default",
          priority: "high", // Ensure high priority for background notifications
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: "Department Updated",
              body: `your suggestion has been sent to ${department.dataValues.label}`,
            },
            badge: 1,
            sound: "default",
          },
        },
      },
    };

    await Messages.create({
      receiver_id: parseInt(suggestion.dataValues.submitted_by),
      title: "Department Updated",
      body: `your suggestion has been sent to ${department.dataValues.label}`,
    });

    await admin.messaging().send(message);

    res.status(200).json({
      status: true,
      message: "Department ID updated successfully.",
    });
  } catch (e) {
    console.error("Error updating department ID:", e);
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

export const exportSuggestion = async (req, res) => {
  try {
    const { date } = req.query;
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet(`Suggestion ${date}`);

    // Set column widths
    for (let i = 1; i <= 16; i++) {
      ws.column(i).setWidth(i >= 7 ? 80 : 50);
    }
    ws.row(1).setHeight(40);

    // Styles
    const headerStyle = wb.createStyle({
      font: { size: 15, color: "#ffffff" },
      fill: { type: "pattern", patternType: "solid", fgColor: "2172d7" },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
    });

    const valuesStyleOdd = wb.createStyle({
      font: { size: 13 },
      fill: { type: "pattern", patternType: "solid", fgColor: "#efefef" },
      alignment: { vertical: "center", wrapText: true },
    });

    const valuesStyleEven = wb.createStyle({
      font: { size: 13 },
      alignment: { vertical: "center", wrapText: true },
    });

    // Header cells
    const headers = [
      "Supplier Name", "Supplier Representative", "Designation", "Buyer Name",
      "Buyer Email", "Department", "Improvement Category", "Idea", "EKL Part Name",
      "EKL Part Description", "Benefit", "Change Points", "Before Implementation",
      "After Implementation", "Beneftis After Implementation", "Created At",
    ];

    headers.forEach((h, i) => {
      ws.cell(1, i + 1).string(h).style(headerStyle);
    });

    // Handle date input (month/year or year only)
    const currentDate = new Date();
    let startDate, endDate;
    if (!date) {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (date.includes("/")) {
      const [month, year] = date.split("/").map(Number);
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else if (/^\d{4}$/.test(date)) {
      const year = parseInt(date);
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    } else {
      return res.status(400).json({ status: false, message: "Invalid date format. Use MM/YYYY or YYYY" });
    }

    const suggestions = await Suggestion.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    // Write suggestions data
    for (let index = 0; index < suggestions.length; index++) {
      const val = suggestions[index];
      const rowStyle = index % 2 === 0 ? valuesStyleEven : valuesStyleOdd;

      ws.cell(index + 2, 1).string(val.supplier_name || "").style(rowStyle);
      ws.cell(index + 2, 2).string(val.supplier_representative || "").style(rowStyle);
      ws.cell(index + 2, 3).string(val.designation || "").style(rowStyle);
      ws.cell(index + 2, 4).string(val.buyer_name || "").style(rowStyle);
      ws.cell(index + 2, 5).string(val.buyer_email || "").style(rowStyle);
      ws.cell(index + 2, 6).string(val.department || "").style(rowStyle);
      ws.cell(index + 2, 7).string(val.improvement_category || "").style(rowStyle);
      ws.cell(index + 2, 8).string(val.idea || "").style(rowStyle);
      ws.cell(index + 2, 9).string(val.ekl_part_name || "").style(rowStyle);
      ws.cell(index + 2, 10).string(val.ekl_part_description || "").style(rowStyle);
      ws.cell(index + 2, 11).string(val.benefit || "").style(rowStyle);
      ws.cell(index + 2, 12).string(val.change_points || "").style(rowStyle);
      ws.cell(index + 2, 13).string(val.before_implementation || "").style(rowStyle);
      ws.cell(index + 2, 14).string(val.after_implementation || "").style(rowStyle);
      ws.cell(index + 2, 15).string(val.benefit_after_implementation || "").style(rowStyle);
      ws.cell(index + 2, 16).string(new Date(val.createdAt).toLocaleString()).style(rowStyle);
    }

    const fileName = `Excel_${date.replace("/", "-")}.xlsx`;
    await wb.write(fileName);

    return res.status(200).json({
      status: true,
      file: fileName,
    });

  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ message: "Error exporting suggestions", error });
  }
};



