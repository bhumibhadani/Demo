using BHUMI_Demo.Controllers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BHUMI_Demo.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string EmployeeCode { get; set; }
        [Required]
        [StringLength(50)]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Special characters and numbers are not allowed.")]
        public string EmployeeName { get; set; }
        [Required]
        [CustomValidation(typeof(EmployeeController), "ValidateDOB")]
        public DateTime DOB { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        [Required]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Please enter a valid 10-digit contact number.")]
        public string ContactNo { get; set; }
        [Required]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }
        public string PhotoPath { get; set; }
        public List<EmployeeEducation> Educations { get; set; }
    }

    public class EmployeeEducation
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string Degree { get; set; }
        public int PassingYear { get; set; }
        public decimal Percentage { get; set; }
    }

    public class DateRangeViewModel
    {
        [Required]
        [DataType(DataType.Date)]
        public DateTime FromDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime ToDate { get; set; }
    }
}


