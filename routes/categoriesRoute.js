const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt');

const categoriesData = [
    {
      name: "Accounting and Finance",
      skills: [
        "Accounting",
        "Auditing",
        "Budgeting",
        "Financial analysis",
        "Financial reporting",
        "Tax preparation",
        "Data analysis",
        "Financial modeling",
        "Risk management",
        "Strategic planning",
        "Other"
      ],
    },
    {
      name: "Administrative Support",
      skills: [
        "Clerical",
        "Customer service",
        "Data entry",
        "Filing",
        "Office management",
        "Phone calls",
        "Scheduling",
        "Travel arrangements",
        "Microsoft Office Suite",
        "Customer relationship management (CRM) software",
        "Project management software",
        "Social media management","Other"
      ],
    },
    {
      name: "Advertising and Marketing",
     skills: [
        "Creativity",
        "Communication",
        "Problem-solving",
        "Research",
        "Writing",
        "Media planning",
        "Public relations",
        "Social media marketing",
        "SEO","Other"
      ],
    },
    {
      name: "Architecture and Engineering",
     skills: [
        "Design",
        "Drafting",
        "Construction",
        "Mathematics",
        "Physics",
        "Science",
        "Computer-aided design (CAD) software",
        "Building information modeling (BIM) software",
        "Sustainability",
        "Green building",
        "Other"
      ],
    },
    {
      name: "Arts, Design, and Entertainment",
     skills: ["Photoshop","Figma","Canva","Illustrator","Color Theorey","Video Editing",
        "Visual arts",
        "Performing arts",
        "Writing",
        "Music",
        "Creativity",
        "Communication",
        "Problem-solving",
        "Research",
        "Writing",
        "Other"
      ],
    },
    {
      name: "Customer Service",
     skills: [
        "Communication",
        "Empathy",
        "Problem-solving",
        "Teamwork",
        "Customer satisfaction",
        "Conflict resolution",
        "Negotiation",
        "Other"
      ],
    },
    {
      name: "Education and Training",
     skills: ["Mathematics","English","Science","History","Geography","Art","Music",
        "Communication",
        "Organization",
        "Teaching",
        "Training",
        "Curriculum development",
        "Instruction",
        "Assessment",
        "Evaluation",
        "Other"
      ],
    },
    {
      name: "Management",
     skills:["Communication","MBA",
      "Decision-making",
      "Leadership",
      "Problem-solving",
      "Accounting",
      "Finance",
      "Economics",
      "Other"
  
      ]
    },
    {
      name: "Healthcare",
      skills:["MBBS","MD","Doctor","Dentist","Nurse","EMT","Pharmacist","Therapist","Laboratory","Radiographers","Nurse","Other"]
      
    },
    {
      name: "Human Resources",
     skills: [
        "Talent Acquisition",
        "Employee Relations",
        "Training and Development",
        "Compensation",
        "Benefits",
        "Communication",
        "Empathy",
        "Problem Solving",
        "Teamwork",
        "Other"
      ],
    },
    {
      name: "Information Technology",
      skills: [ "Computer Science", "Technology Certification", "Professional Membership", "Technical and Analytical Skills", "Troubleshooting and Problem Solving", "Independent and Team Work", "Communication Skills","Microsoft Word","PowerPoint", "Learning and Adaptability", "JavaScript", "Python", "Go", "Java", "Kotlin", "C#", "PHP", "Swift", "R", "Ruby", "C", "C++", "TypeScript", "SQL", "Nix", "Scala", "Shell", "Rust", "Dart", "DM" ,"Django", "ExpressJS", "Laravel", "Ruby on Rails", "Flask", "React", "Angular", "Vue", "Svelte", "Next.js","Other" ]
    },
    {
      name: "Legal",
      skills:[ "Law", "Legal Research", "Legal Writing", "Litigation", "Contract Drafting", "Negotiation", "Mediation", "Arbitration", "Compliance", "Corporate Governance", "Intellectual Property", "Criminal Justice", "Family Law", "Tax Law", "Environmental Law", "Human Rights", "LexisNexis", "Westlaw","Other" ]
  
    },
    {
      name: "Logistics and Supply Chain",
      skills: [ "Supply Chain Management", "Logistics", "Inventory Management", "Procurement", "Sourcing", "Warehousing", "Distribution", "Transportation", "Operations Management", "Customer Service", "Forecasting", "Planning", "Analysis", "Optimization", "ERP", "SAP", "Oracle", "Excel", "Power BI", "Tableau","Other" ]
    },
    {
      name: "Manufacturing",
      skills: [ "Engineering", "Design", "Production", "Quality Control", "Lean Manufacturing", "Six Sigma", "Kaizen", "5S", "Continuous Improvement", "Safety", "Maintenance", "Troubleshooting", "Machining", "Welding", "Assembly", "CAD", "SolidWorks", "AutoCAD", "PLC", "Robotics","Other" ]
    },
   
    {
      name: "Non-Profit",
     skills:["Other"]
    },
    {
      name: "Sales",
     skills: [ "Sales", "Marketing", "Customer Service", "Communication", "Negotiation", "Persuasion", "Product Knowledge", "Presentation", "Closing", "Follow-up", "CRM", "Salesforce", "HubSpot", "Zoho", "Microsoft Office", "Google Workspace", "Social Media", "LinkedIn", "Email Marketing", "SEO","Other" ]
    },
    {
      name: "Science and Technology",
      skills: [ "Biology", "Chemistry", "Physics", "Mathematics", "Statistics", "Data Science", "Machine Learning", "Artificial Intelligence", "Computer Science", "Engineering", "Research", "Analysis", "Experimentation", "Innovation", "Critical Thinking", "Problem Solving", "Python", "R", "Matlab", "TensorFlow","Other" ]
    },
    {
      name: "Security",
      skills: [ "Security", "Cybersecurity", "Information Security", "Network Security", "Physical Security", "Risk Management", "Compliance", "Audit", "Incident Response", "Forensics", "Ethical Hacking", "Penetration Testing", "Malware Analysis", "Encryption", "Firewall", "VPN", "SIEM", "NIST", "ISO 27001", "CISSP" ,"Other"]
    },
    {
      name: "Sports and Recreation",
      skills: [ "Sports", "Athletics", "Fitness", "Health", "Wellness", "Coaching", "Training", "Teaching", "Mentoring", "Leadership", "Teamwork", "Communication", "Motivation", "Strategy", "Performance", "Analysis", "Feedback", "Nutrition", "Injury Prevention", "Recovery" ,"Other"]
    },
    {
      name: "Travel and Tourism",
      skills: [ "Travel", "Tourism", "Hospitality", "Customer Service", "Communication", "Interpersonal Skills", "Multilingual", "Cultural Awareness", "Geography", "History", "Planning", "Organizing", "Booking", "Sales", "Marketing", "Social Media", "Budgeting", "Problem Solving", "Creativity", "Flexibility","Other" ]
    },
    {
      name:"Writing",
      skills: [ "Writing", "Editing", "Proofreading", "Grammar", "Spelling", "Punctuation", "Vocabulary", "Style", "Tone", "Voice", "Creativity", "Research", "Analysis", "Critical Thinking", "Storytelling", "Content Creation", "Blogging", "Copywriting", "SEO", "WordPress","Other" ]
    },
    {
      name:"Others",
      skills:["Other"]
    }
  ];
  
router.get('/',async(req,res)=>{
    res.status(200).json({categories:categoriesData});
})

module.exports = router;