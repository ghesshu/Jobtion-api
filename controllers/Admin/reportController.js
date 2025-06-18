const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");


/**
 * Generate weekly payroll report matching CSV format
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Object} Weekly payroll report with detailed breakdown
 */
async function getWeeklyPayrollReport(req, res, what2do = 'fetch') {
  const { start_date: startDate, end_date: endDate } = req.body;

  let fetch_all;

  if (!startDate || !endDate) {
    fetch_all = true;
    // return res.status(422).json(
    //   Response({
    //     success: false,
    //     message: "Start date and end date are required.",
    //   })
    // );
  }

    // Check that the range is exactly 7 days
    // const start = new Date(startDate);
    // const end = new Date(endDate);
    // const timeDiff = end.getTime() - start.getTime();
    // const dayDiff = timeDiff / (1000 * 3600 * 24);

    // console.log(dayDiff);

    // if (dayDiff !== 6) {
    //   return res.status(422).json(
    //     Response({
    //       success: false,
    //       message:
    //         "Date range must be exactly one week (7 days, including start and end).",
    //     })
    //   );
    // }


    const rangeKey = `${startDate} to ${endDate}`;
//   console.log("startDate:", startDate, "endDate:", endDate);

  try {
    let query;
    if (fetch_all) {
      query =`
      SELECT 
        -- Basic job and user information
        CONCAT('JOB-', pj.id, '-', candidate_user.id, '-', DATE_FORMAT(MIN(app.created_at), '%Y%m%d')) as OurRef,
        COALESCE(company_user.company_name, 'N/A') as CompanyName,
        COALESCE(company_user.address, 'N/A') as FullAddress,
        COALESCE(pj.posted_start_date) as SlotStart,
        COALESCE(candidate_user.sega_name, CONCAT(candidate_user.first_name, ' ', candidate_user.last_name)) as SageName,
        candidate_user.id as CandidateID,
        CONCAT(candidate_user.first_name, ' ', COALESCE(candidate_user.last_name, '')) as TempName,
        pj.job_title as JobTitle,
        COALESCE(candidate_user.paye_selfemp, 'PAYE') as PayeSelfEmp,
        app.updated_at as completed_date,
        
        -- Time calculations - sum all completed days
        SUM(TIME_TO_SEC(TIMEDIFF(
          STR_TO_DATE(cj.end, '%H:%i'), 
          STR_TO_DATE(cj.start, '%H:%i')
        )) / 3600) as gross_hours,
        
        SUM(CASE 
          WHEN cj.break_time = '0' OR cj.break_time IS NULL THEN 0
          ELSE TIME_TO_SEC(STR_TO_DATE(cj.break_time, '%H:%i')) / 3600
        END) as break_hours,
        
        -- Payment information
        pj.payment_type,
        COALESCE(pj.amount, pj.per_hour, pj.price_per_hour, 0) as base_amount,
        
        -- Additional fields
        COALESCE(candidate_user.po_number, 'N/A') as PONumber,
        CONCAT(company_user.first_name, ' ', COALESCE(company_user.last_name, '')) as Owner,
        CONCAT('Total of ', COUNT(cj.id), ' completed days') as Notes,
        
        -- Job and application details
        GROUP_CONCAT(DISTINCT cj.day ORDER BY cj.day SEPARATOR ', ') as days_worked,
        pj.id as job_id,
        candidate_user.id as user_id,
        MAX(app.status) as application_status,
        COUNT(cj.id) as total_completed_days
        
      FROM applications app
      INNER JOIN posted_jobs pj ON app.job = pj.id
      INNER JOIN completed_job cj ON pj.id = cj.job_id AND app.candidate = cj.user_id
      INNER JOIN users candidate_user ON app.candidate = candidate_user.id
      INNER JOIN users company_user ON pj.company = company_user.id
      
      WHERE cj.break_time_updated  = 2
      
      GROUP BY 
        pj.id, 
        candidate_user.id, 
        company_user.id,
        pj.job_title,
        pj.payment_type,
        pj.amount,
        pj.per_hour,
        pj.price_per_hour,
        candidate_user.sega_name,
        candidate_user.first_name,
        candidate_user.last_name,
        candidate_user.paye_selfemp,
        candidate_user.po_number,
        company_user.company_name,
        company_user.address,
        company_user.first_name,
        company_user.last_name
      
        ORDER BY app.updated_at DESC LIMIT 10
    `;
    }
    else{
       query =`
      SELECT 
        -- Basic job and user information
        CONCAT('JOB-', pj.id, '-', candidate_user.id, '-', DATE_FORMAT(MIN(app.created_at), '%Y%m%d')) as OurRef,
        COALESCE(company_user.company_name, 'N/A') as CompanyName,
        COALESCE(company_user.address, 'N/A') as FullAddress,
        COALESCE(pj.posted_start_date) as SlotStart,
        COALESCE(candidate_user.sega_name, CONCAT(candidate_user.first_name, ' ', candidate_user.last_name)) as SageName,
        candidate_user.id as CandidateID,
        CONCAT(candidate_user.first_name, ' ', COALESCE(candidate_user.last_name, '')) as TempName,
        pj.job_title as JobTitle,
        COALESCE(candidate_user.paye_selfemp, 'PAYE') as PayeSelfEmp,
        app.updated_at as completed_date,
        
        -- Time calculations - sum all completed days
        SUM(TIME_TO_SEC(TIMEDIFF(
          STR_TO_DATE(cj.end, '%H:%i'), 
          STR_TO_DATE(cj.start, '%H:%i')
        )) / 3600) as gross_hours,
        
        SUM(CASE 
          WHEN cj.break_time = '0' OR cj.break_time IS NULL THEN 0
          ELSE TIME_TO_SEC(STR_TO_DATE(cj.break_time, '%H:%i')) / 3600
        END) as break_hours,
        
        -- Payment information
        pj.payment_type,
        COALESCE(pj.amount, pj.per_hour, pj.price_per_hour, 0) as base_amount,
        
        -- Additional fields
        COALESCE(candidate_user.po_number, 'N/A') as PONumber,
        CONCAT(company_user.first_name, ' ', COALESCE(company_user.last_name, '')) as Owner,
        CONCAT('Total of ', COUNT(cj.id), ' completed days') as Notes,
        
        -- Job and application details
        GROUP_CONCAT(DISTINCT cj.day ORDER BY cj.day SEPARATOR ', ') as days_worked,
        pj.id as job_id,
        candidate_user.id as user_id,
        MAX(app.status) as application_status,
        COUNT(cj.id) as total_completed_days
        
      FROM applications app
      INNER JOIN posted_jobs pj ON app.job = pj.id
      INNER JOIN completed_job cj ON pj.id = cj.job_id AND app.candidate = cj.user_id
      INNER JOIN users candidate_user ON app.candidate = candidate_user.id
      INNER JOIN users company_user ON pj.company = company_user.id
      
      WHERE cj.break_time_updated  = 2
        AND DATE(app.updated_at) BETWEEN ? AND ?
      
      GROUP BY 
        pj.id, 
        candidate_user.id, 
        company_user.id,
        pj.job_title,
        pj.payment_type,
        pj.amount,
        pj.per_hour,
        pj.price_per_hour,
        candidate_user.sega_name,
        candidate_user.first_name,
        candidate_user.last_name,
        candidate_user.paye_selfemp,
        candidate_user.po_number,
        company_user.company_name,
        company_user.address,
        company_user.first_name,
        company_user.last_name
      
      ORDER BY app.updated_at DESC
    `;
    }
     
    let rows;
    if (fetch_all) {
       rows = await db.query(query, []);
    }
    else{
       rows = await db.query(query, [startDate, endDate]);
    }
    
    
    
    // Process the results and calculate payroll details
    const processedResults = rows.map(row => {
      // Calculate actual hours worked (gross hours - break hours)
      const decimalHours = parseFloat((row.gross_hours - row.break_hours).toFixed(2));
      let amount = 0;
      
      // Calculate base amount based on payment type
      switch (row.payment_type?.toLowerCase()) {
        case 'per_hour':
          amount = decimalHours * parseFloat(row.base_amount);
          break;
        case 'per_day':
          amount = parseFloat(row.base_amount);
          break;
        case 'per_month':
          // Assuming 22 working days per month
          amount = parseFloat(row.base_amount) / 22;
          break;
        default:
          amount = decimalHours * parseFloat(row.base_amount);
      }
      
      // Apply the rate calculation logic from your PHP code
      const rate = Math.round(amount * 0.02 * 100) / 100;
      const charge = Math.round(amount * 0.05 * 100) / 100;
      const tspay = Math.round(decimalHours * rate * 100) / 100;
      const margin = Math.round(charge * 100) / 100;
      const totalInvoice = Math.round((rate + charge + tspay) * 100) / 100;
      const plusVat = Math.round(totalInvoice * 0.20 * 100) / 100;
      // const new_date = row.completed_date.slice(0, 10)
      const date = new Date(row.completed_date);
      const dateOnly = date.toISOString().split("T")[0];

      return {
        'OurRef': row.OurRef,
        'CompanyName': row.CompanyName,
        'FullAddress': row.FullAddress,
        'SlotStart': row.SlotStart,
        'completed_date': dateOnly,
        'Sage Name': row.SageName,
        'CandidateID': row.CandidateID,
        'Temp Name': row.TempName,
        'Job title': row.JobTitle,
        'PAYE/Self Emp': row.PayeSelfEmp,
        ' Rate ': `£${rate.toFixed(2)}`,
        ' Charge ': `£${charge.toFixed(2)}`,
        ' TSPay ': `£${tspay.toFixed(2)}`,
        ' Margin ': `£${margin.toFixed(2)}`,
        'DecimalHours': decimalHours,
        ' TotalInvoice ': `£${totalInvoice.toFixed(2)}`,
        ' PlusVat ': `£${plusVat.toFixed(2)}`,
        'payroll_provider': 'Internal System',
        'PONumber': row.PONumber,
        'Owner': row.Owner,
        'Notes':"",
        
        // Additional calculation details (not in CSV but useful for debugging)
        '_calculation_details': {
          base_amount: amount,
          payment_type: row.payment_type,
          gross_hours: row.gross_hours,
          break_hours: row.break_hours,
          decimal_hours: decimalHours
        }
      };
    });
    
    // Calculate summary statistics
    const summary = {
      total_records: processedResults.length,
      total_hours: processedResults.reduce((sum, record) => sum + record.DecimalHours, 0),
      total_tspay: processedResults.reduce((sum, record) => {
        return sum + parseFloat(record[' TSPay '].replace('£', ''));
      }, 0),
      total_invoice: processedResults.reduce((sum, record) => {
        return sum + parseFloat(record[' TotalInvoice '].replace('£', ''));
      }, 0),
      total_vat: processedResults.reduce((sum, record) => {
        return sum + parseFloat(record[' PlusVat '].replace('£', ''));
      }, 0),
      unique_companies: [...new Set(processedResults.map(r => r.CompanyName))].length,
      unique_candidates: [...new Set(processedResults.map(r => r.CandidateID))].length
    };

    const payload = {
        // date_range: { start_date: startDate, end_date: endDate },
      summary: summary,
      payroll_records: processedResults
    }

    if(what2do === 'generate') {
        const load = {
            success: true,
        date_range: { start_date: startDate, end_date: endDate },
      summary: summary,
      payroll_records: processedResults
    }
      // If the request is to generate payslips, return the payload
      return load;

    }

    res.status(200).json(
      Response({
        success: true,
        message: `Fetched report for  ${ fetch_all ? "latest 10" : `${rangeKey}`}`,
        data: payload,
      })
    );
    
    // return {
    //   success: true,
    //   date_range: { start_date: startDate, end_date: endDate },
    //   summary: summary,
    //   payroll_records: processedResults
    // };
    
  } catch (error) {
    console.error('Error fetching weekly payroll report:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    console.log("end")
    // if (db) {
    //   await db.end();
    // }
  }
}

/**
 * Generate CSV format string from payroll data
 * @param {Array} payrollRecords - Array of payroll records
 * @returns {string} CSV formatted string
 */
function generateCSV(payrollRecords) {
  if (!payrollRecords || payrollRecords.length === 0) {
    return '';
  }
  
  // Define headers matching the uploaded CSV
  const headers = [
    'OurRef', 'CompanyName', 'FullAddress', 'SlotStart', 'Sage Name',
    'CandidateID', 'Temp Name', 'Job title', 'PAYE/Self Emp', ' Rate ',
    ' Charge ', ' TSPay ', ' Margin ', 'DecimalHours', ' TotalInvoice ',
    ' PlusVat ', 'payroll_provider', 'PONumber', 'Owner', 'Notes'
  ];
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  payrollRecords.forEach(record => {
    const row = headers.map(header => {
      let value = record[header] || '';
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
}

/**
 * Express.js route handler for weekly payroll report
 */
async function weeklyPayrollReportHandler(req, res) {
  try {
    const { start_date, end_date, format } = req.query;
    
    // Validate required parameters
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date and end_date are required parameters (YYYY-MM-DD format)'
      });
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format'
      });
    }
    
    // Validate that start_date is before end_date
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({
        success: false,
        message: 'start_date must be before end_date'
      });
    }
    
    const report = await getWeeklyPayrollReport(start_date, end_date);
    
    if (!report.success) {
      return res.status(500).json(report);
    }
    
    // Return CSV format if requested
    if (format === 'csv') {
      const csvContent = generateCSV(report.payroll_records);
      const filename = `weekly_payroll_report_${Date.now()}_${start_date.replace(/-/g, '')}_${end_date.replace(/-/g, '')}.csv`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csvContent);
    }
    
    // Return JSON format by default
    res.json(report);
    
  } catch (error) {
    console.error('Error in weekly payroll report handler:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Store payslip data for candidates
 * @body {string} startDate - Start date in YYYY-MM-DD format
 * @body {string} endDate - End date in YYYY-MM-DD format
 * @returns {Object} Result of payslip storage operation
 */
async function storePayslipData(req, res) {
  
  try {
    console.log(req.body)
    // Get payroll data first
    const payrollReport = await getWeeklyPayrollReport(req, res, 'generate');

    
    if (!payrollReport.success || !payrollReport.payroll_records.length) {
      return {
        success: false,
        message: 'No payroll data found for the specified date range'
      };
    }
    
    // Query to get additional data needed for payslip
    const payslipDataQuery = `
        SELECT 
            pj.id as job_id,
            app.candidate as candidate_id,
            pj.company as company_id,
            pj.posted_start_date as start_date,
            app.updated_at as end_date,
            SUM(cj.subtotal) as total_subtotal,
            MIN(cj.start) as earliest_start,
            MAX(cj.end) as latest_end
        FROM applications app
        INNER JOIN posted_jobs pj ON app.job = pj.id
        INNER JOIN completed_job cj ON pj.id = cj.job_id AND app.candidate = cj.user_id
        INNER JOIN users candidate_user ON app.candidate = candidate_user.id
        INNER JOIN users company_user ON pj.company = company_user.id
        WHERE cj.break_time_updated = 2
            AND DATE(app.updated_at) BETWEEN ? AND ?
        GROUP BY 
            pj.id, 
            app.candidate,
            pj.company,
            pj.posted_start_date,
            app.updated_at
        ORDER BY app.created_at, pj.id, app.candidate
        `;

const payslipData = await db.query(payslipDataQuery, [req.body.start_date, req.body.end_date]);
    
    if (!payslipData.length) {
      return {
        success: false,
        message: 'No data available to create payslips'
      };
    }
    
    // Prepare batch insert data
    const insertData = payslipData.map( async record => {
      // Find corresponding payroll record to get calculated subtotal
      const payrollRecord = payrollReport.payroll_records.find(pr => 
        pr.CandidateID === record.candidate_id && 
        pr._calculation_details && 
        pr._calculation_details.base_amount
      );

      const subtotal = payrollRecord ? parseFloat(payrollRecord[' TSPay '].replace('£', '')) : record.total_subtotal || 0;

      const existing = await db.query(
        `SELECT id FROM payslip WHERE start = ? AND end = ? LIMIT 1`,
        [record.start_date || record.earliest_start, record.end_date]
      );

      if (existing.length === 0) {
        await db.query(
          `INSERT INTO payslip (job_id, candidate_id, company_id, subtotal, start, end, break_time_updated)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [ record.job_id, record.candidate_id, record.company_id, subtotal, record.start_date || record.earliest_start, record.end_date, 2]
        );
        return {  inserted: true};
      } else {
        return { inserted: false };
      }

       
      
    //   const calculatedSubtotal = payrollRecord ? 
    //     parseFloat(payrollRecord[' TSPay '].replace('£', '')) : 
    //     record.total_subtotal || 0;
      
    //   return [
    //     record.job_id,
    //     record.candidate_id,
    //     record.company_id,
    //     calculatedSubtotal,
    //     record.start_date || record.earliest_start, // Use posted_start_date or fallback to earliest start
    //     record.end_date, // applications.updated_at
    //     2 // break_time_updated = 2 (completed)
    //   ];
    });

    console.log("insert : ",insertData)
    //******let's check if the payslip already exists */
    // const insertPromises = insertData.map(async ([job_id, candidate_id, company_id, subtotal, start_date, end_date, status]) => {
    //   const existing = await db.query(
    //     `SELECT id FROM payslip WHERE start = ? AND end = ? LIMIT 1`,
    //     [start_date, end_date]
    //   );

    //   if (existing.length === 0) {
    //     await db.query(
    //       `INSERT INTO payslip (job_id, candidate_id, company_id, subtotal, start, end, break_time_updated)
    //        VALUES (?, ?, ?, ?, ?, ?, ?)`,
    //       [job_id, candidate_id, company_id, subtotal, start_date, end_date, status]
    //     );
    //     return {  inserted: true, start_date, end_date };
    //   } else {
    //     return { inserted: false, start_date, end_date };
    //   }
    // });
    // Execute all insertions in parallel
   const final =  await Promise.all(insertData);
    
    // Check for existing payslips to avoid duplicates
    // const existingPayslipsQuery = `
    //   SELECT job_id, candidate_id, company_id 
    //   FROM payslip 
    //   WHERE (job_id, candidate_id, company_id) IN (${insertData.map(() => '(?, ?, ?)').join(', ')})
    // `;
    
    // const existingParams = insertData.flatMap(item => [item[0], item[1], item[2]]);

     
    // const existingPayslips = await db.query(existingPayslipsQuery, [existingParams]);
    
     // Filter out existing records
    // const existingSet = new Set(
    //   existingPayslips.map(ep => `${ep.job_id}-${ep.candidate_id}-${ep.company_id}`)
    // );
    
    // const newInsertData = insertData.filter(item => 
    //   !existingSet.has(`${item[0]}-${item[1]}-${item[2]}`)
    // );
    
    // if (!newInsertData.length) {
    //   return {
    //     success: true,
    //     message: 'All payslips already exist for this date range',
    //     inserted_count: 0,
    //     duplicate_count: insertData.length
    //   };
    // }

    
    // //Insert new payslip records
    // const insertQuery = `
    //   INSERT INTO payslip 
    //   (job_id, candidate_id, company_id, subtotal, start, end, break_time_updated)
    //   VALUES ${newInsertData.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ')}
    // `;
    
    // const insertParams = newInsertData.flat();
    // const insertResult = await db.query(insertQuery, [insertParams]);
    
    // const payload =  {
    //   inserted_count: final.affectedRows,
    //   total_processed: final.length
    // };

    res.status(200).json(
      Response({
        success: true,
        message: `Stored weekly payslip for ${req.body.start_date} - ${req.body.end_date}`,
        // data: payload,
      })
    );
    
  } catch (error) {
    console.error('Error storing payslip data:', error);
    return {
      success: false,
      error: error.message
    };
  } 
}

module.exports = {
  getWeeklyPayrollReport,
  weeklyPayrollReportHandler,
  generateCSV,
  storePayslipData
};