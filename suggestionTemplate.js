export const suggestionTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EKL Supplier Suggestion Form</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background-color: #f9f9f9;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      width: 200px;
    }

    .suggestion-box {
      width: 80px;
      height: auto;
    }

    h1 {
      text-align: center;
      color: #0b6fa4;
    }

    form {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    label {
      display: block;
      margin-top: 15px;
      font-weight: bold;
    }

    input[type="text"],
    textarea,
    select {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 10px;
    }

    .checkbox-group label {
      font-weight: normal;
    }

    .footer {
      margin-top: 40px;
      font-style: italic;
      text-align: center;
    }

    .signature-section {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
    }

    .signature-section div {
      width: 48%;
    }
  </style>
</head>
<body>

  <div class="header">
    <img src="https://img1.wsimg.com/isteam/ip/e6df30be-5e3b-4808-b4fc-bd2d6f3c397b/Escorts%20Kubota%20Ltd.png" alt="EKL Logo" class="logo" >
    <img src="https://media.istockphoto.com/id/501685831/vector/suggestion-box-with-feedback-notes.jpg?s=612x612&w=0&k=20&c=yd6bf91v0tpYXuMwkWozlyc44_AC3oZmeYThhJgEq_U=" alt="Suggestion Box" class="suggestion-box">
  </div>

  <h1>EKL SUPPLIER SUGGESTION FORM</h1>

  <form>
    <label>Supplier Name:</label>
    <input type="text" value="{{supplier_name}}">


    <label>Supplier Representative:</label>
    <input type="text" value="{{supplier_representative}}">

    <label>EKL Buyer Name:</label>
    <input type="text" value="{{buyer_name}}">

    <label>EKL Buyer Email:</label>
    <input type="text" value="{{buyer_email}}">
    
    <label>Designation:</label>
    <input type="text" value="{{designation}}">


    <label>Suggestion Idea/Proposal:</label>
    <input type="text" value={{idea}}>

    <label>EKL Part Name:</label>
    <input type="text" value={{ekl_part_name}}>

    <label>EKL Part Description:</label>
    <input type="text" value={{ekl_part_description}} >

    <label>Benefit (No's):</label>
    <input type="text" value={{benefit}}>


    <label>Idea Description (Before Implementation):</label>
    <textarea rows="4">{{before_implementation}}</textarea>

    <label>Idea Description (After Implementation) : </label>
    <textarea rows="4" >{{after_implementation}}</textarea>

    <label>Benefits After Implementation</label>
    <textarea rows="4">{{benefit_after_implementation}}</textarea>

    <div class="signature-section">
      <div>
        <label>Suggestor's Signature/Name:</label>
        <input type="text">
      </div>
      <div>
        <label>Date:</label>
        <input type="text" value={{createdAt}}>
      </div>
    </div>

    <label>Improvement Category:</label>
    <input type="text" value={{improvement_category}}>

    <label>Change Points:</label>
    <input type="text" value={{change_points}}>
  </form>

  <div class="footer">
    Thank you for your suggestions.<br>
    If an organization values innovation, one can assume it is safe to speak up with new ideas and the voice matters.
  </div>
</body>
</html>`
