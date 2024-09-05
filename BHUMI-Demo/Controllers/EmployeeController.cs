using BHUMI_Demo.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Mvc;
using System.Linq;
using Dapper;
using System.IO;
using System.ComponentModel.DataAnnotations;
using System.Web.Http;

namespace BHUMI_Demo.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly string connectionString;
        public EmployeeController()
        {
            // Retrieve connection string from configuration
            connectionString = System.Configuration.ConfigurationManager.AppSettings["dbConnection"];
        }
        public ActionResult Index(string search = "")
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                IEnumerable<Employee> employees;

                // Call stored procedure using Dapper with or without search parameter
                if (!string.IsNullOrEmpty(search))
                {
                    // Assuming your stored procedure can accept a search parameter
                    var parameters = new { SearchTerm = search };
                    employees = db.Query<Employee>("USP_GET_EmployeeDetails", parameters, commandType: CommandType.StoredProcedure);
                }
                else
                {
                    // Call stored procedure without search parameter
                    employees = db.Query<Employee>("USP_GET_EmployeeDetails", commandType: CommandType.StoredProcedure);
                }

                ViewBag.Items = employees.ToList();
            }

            return View();
        }
        public ActionResult Create(int? id)
        {
            Employee model = new Employee();
            List<EmployeeEducation> edu = new List<EmployeeEducation>();
            bool isEdit = false;

            if (id.HasValue)
            {
                using (IDbConnection db = new SqlConnection(connectionString))
                {
                    model = db.Query<Employee>("SELECT * FROM Employee WHERE Id = @Id", new { Id = id.Value }).FirstOrDefault();
                    if (model == null)
                    {
                        return HttpNotFound();
                    }
                    model.Educations = db.Query<EmployeeEducation>("SELECT * FROM EmployeeEducation WHERE EmployeeId = @Id", new { Id = id.Value }).ToList();
                }
                isEdit = true;
            }

            ViewBag.IsEdit = isEdit;
            return View("Create", model);
        }
        public JsonResult CheckEmployeeName(string employeeName)
        {
            bool exists = false;
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                exists = db.QuerySingleOrDefault<bool>("SELECT COUNT(*) FROM Employee WHERE EmployeeName = @EmployeeName", new { EmployeeName = employeeName });
            }
            return Json(new { exists });
        }
        public ActionResult Delete(int id)
        {
            using (IDbConnection db = new SqlConnection(connectionString))
            {
                // Check if the employee exists
                var employee = db.Query<Employee>("SELECT * FROM Employee WHERE Id = @Id", new { Id = id }).FirstOrDefault();
                if (employee == null)
                {
                    return HttpNotFound();
                }

                // Delete employee education details
                db.Execute("DELETE FROM EmployeeEducation WHERE EmployeeId = @Id", new { Id = id });

                // Delete the employee
                db.Execute("DELETE FROM Employee WHERE Id = @Id", new { Id = id });

                return RedirectToAction("Index");
            }
        }
        [System.Web.Mvc.HttpPost]
        public ActionResult Create(Employee model, HttpPostedFileBase Photo, bool isEdit = false)
        {
            if (ModelState.IsValid)
            {
                using (IDbConnection db = new SqlConnection(connectionString))
                {
                    // Handle photo upload
                    if (Photo != null && Photo.ContentLength > 0)
                    {
                        var validExtensions = new[] { ".jpg", ".jpeg", ".png" };
                        var extension = Path.GetExtension(Photo.FileName).ToLower();
                        if (!validExtensions.Contains(extension))
                        {
                            ModelState.AddModelError("", "Only JPG and PNG formats are allowed.");
                            return View("Create", model);
                        }

                        var fileName = Guid.NewGuid() + extension;
                        var path = Path.Combine(Server.MapPath("~/Content/Images/"), fileName);
                        Photo.SaveAs(path);
                        model.PhotoPath = fileName;
                    }
                    else if (isEdit)
                    {
                        // Retain existing photo if no new photo is uploaded
                        var existingEmployee = db.Query<Employee>("SELECT PhotoPath FROM Employee WHERE Id = @Id", new { Id = model.Id }).FirstOrDefault();
                        model.PhotoPath = existingEmployee?.PhotoPath;
                    }

                    // Insert or update employee details
                    if (isEdit)
                    {
                        string updateEmployeeQuery = @"UPDATE Employee 
                                               SET EmployeeName = @EmployeeName,
                                                   DOB = @DOB, Age = @Age, Gender = @Gender, ContactNo = @ContactNo, 
                                                   Email = @Email, PhotoPath = @PhotoPath 
                                               WHERE Id = @Id";
                        db.Execute(updateEmployeeQuery, model);

                        // Update education details: delete existing and insert new
                        db.Execute("DELETE FROM EmployeeEducation WHERE EmployeeId = @Id", new { Id = model.Id });

                        if (model.Educations != null && model.Educations.Count > 0)
                        {
                            foreach (var education in model.Educations)
                            {
                                education.EmployeeId = model.Id;
                                string insertEducationQuery = @"INSERT INTO EmployeeEducation (Degree, PassingYear, Percentage, EmployeeId) 
                                                        VALUES (@Degree, @PassingYear, @Percentage, @EmployeeId)";
                                db.Execute(insertEducationQuery, education);
                            }
                        }
                    }
                    else
                    {
                        // Insert new employee
                        model.EmployeeCode = GenerateEmployeeCode();
                        string insertEmployeeQuery = @"INSERT INTO Employee (EmployeeCode, EmployeeName, DOB, Age, Gender, ContactNo, Email, PhotoPath) 
                                               VALUES (@EmployeeCode, @EmployeeName, @DOB, @Age, @Gender, @ContactNo, @Email, @PhotoPath);
                                               SELECT CAST(SCOPE_IDENTITY() as int)";
                        var employeeId = db.Query<int>(insertEmployeeQuery, model).Single();
                        model.Id = employeeId;

                        // Insert education details
                        if (model.Educations != null && model.Educations.Count > 0)
                        {
                            foreach (var education in model.Educations)
                            {
                                education.EmployeeId = model.Id;
                                string insertEducationQuery = @"INSERT INTO EmployeeEducation (Degree, PassingYear, Percentage, EmployeeId) 
                                                        VALUES (@Degree, @PassingYear, @Percentage, @EmployeeId)";
                                db.Execute(insertEducationQuery, education);
                            }
                        }
                    }

                    return RedirectToAction("Index");
                }
            }

            return View("Create", model);
        }


        public static ValidationResult ValidateDOB(DateTime dob, ValidationContext context)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;

            if (dob > today)
            {
                return new ValidationResult("DOB cannot be a future date.");
            }

            if (age < 18)
            {
                return new ValidationResult("Employee must be at least 18 years old.");
            }

            return ValidationResult.Success;
        }
        private string GenerateEmployeeCode()
        {
            return "EMP" + DateTime.Now.Ticks.ToString().Substring(0, 6);
        }

        #region Employee Report
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/employee-report")]
        public IHttpActionResult GetEmployeeReport(DateTime fromDate, DateTime toDate)
        {
            // Validate date range
            if (fromDate > toDate)
            {
                var errorResponse = new
                {
                    Success = false,
                    Message = "From date cannot be later than to date."
                };
                return (IHttpActionResult)Json(errorResponse); // Return a JSON response with the error message
            }

            try
            {
                using (IDbConnection db = new SqlConnection(connectionString))
                {
                    var parameters = new { FromDate = fromDate, ToDate = toDate };
                    var employees = db.Query<Employee>("sp_GetEmployeesByDateRange", parameters, commandType: CommandType.StoredProcedure);

                    if (employees.Any())
                    {
                        var successResponse = new
                        {
                            Success = true,
                            Data = employees
                        };
                        return (IHttpActionResult)Json(successResponse); // Return JSON response with employee data
                    }
                    else
                    {
                        var noDataResponse = new
                        {
                            Success = true,
                            Message = "No employees found for the specified date range."
                        };
                        return (IHttpActionResult)Json(noDataResponse); // Return JSON response with no data message
                    }
                }
            }
            catch (Exception ex)
            {
                // Return a generic error response
                var errorResponse = new
                {
                    Success = false,
                    Message = "An error occurred while fetching the employee data.",
                    Error = ex.Message
                };
                return (IHttpActionResult)Json(errorResponse);
            }
        }
        public ActionResult EmployeeReport()
        {
            return View(new DateRangeViewModel());
        }

        // Action to generate the report based on date range
        public ActionResult Report(DateRangeViewModel model)
        {
            if (ModelState.IsValid)
            {
                using (IDbConnection db = new SqlConnection(connectionString))
                {
                    var parameters = new { FromDate = model.FromDate, ToDate = model.ToDate };
                    var employees = db.Query<Employee>("sp_GetEmployeesByDateRange", parameters, commandType: CommandType.StoredProcedure);
                    return View(employees); // Pass the data to the view for displaying the report
                }
            }
            return View("EmployeeReport", model); // If validation fails, redisplay the form with validation messages
        }
        #endregion
    }
}