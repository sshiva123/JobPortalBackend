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
     skills: ["Figma","Canva","Illustrator","Color Theorey","Video Editing",
     "Graphic Design",
     "UI/UX Design",
     "Illustration",
     "Photography",
     "Animation",
     "Creative Thinking",
     "Visual Arts",
     "Typography",
     "Color Theory",
     "Adobe Creative Suite (Photoshop, Illustrator, InDesign)",
     "Sketching and Drawing",
     "Knowledge of Design Principles",
     "Communication Skills",
        "Other"
      ],
    },
    {
      name: "Customer Service",
     skills: [
      "Communication Skills",
      "Empathy",
      "Problem-solving",
      "Active Listening",
      "Conflict Resolution",
      "Patience",
      "Positive Attitude",
      "Teamwork",
      "Attention to Detail",
      "Time Management",
      "Product Knowledge",
      "Ability to Handle Difficult Customers",
      "Multi-tasking",
      "Adaptability",
      "Other"
      ],
    },
    {
      name: "Education and Training",
     skills: ["Mathematics","English","Science","History","Geography","Art","Music",
     "Teaching",
     "Curriculum Development",
     "Lesson Planning",
     "Instructional Design",
     "Assessment and Evaluation",
     "Classroom Management",
     "Communication Skills",
     "Knowledge of Learning Theories",
     "Adaptability",
     "Organization Skills",
     "Technology Integration",
     "Problem-solving",
     "Student Engagement",
        "Other"
      ],
    },
    {
      name: "Management",
     skills:["Leadership",
     "Strategic Planning",
     "Decision-making",
     "Team Management",
     "Project Management",
     "Communication Skills",
     "Financial Acumen",
     "Analytical Skills",
     "Problem-solving",
     "Negotiation",
     "Conflict Resolution",
     "Change Management",
     "Performance Management",
     "Business Development",
      "Other"
  
      ]
    },
    {
      name: "Healthcare",
      skills:["MBBS","MD","Doctor","Dentist","Nurse","EMT","Pharmacist","Therapist","Laboratory","Radiographers","Other"]
      
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
      "name": "Software Development",
      "skills": [
        "Java",
        "Python",
        "C++",
        "JavaScript",
        "HTML",
        "CSS",
        "React",
        "Angular",
        "Vue.js",
        "Node.js",
        "Express.js",
        "Django",
        "Flask",
        "Ruby",
        "Ruby on Rails",
        "PHP",
        "Laravel",
        "ASP.NET",
        "C#",
        "Spring Boot",
        "Hibernate",
        "Go",
        "Rust",
        "Swift",
        "Kotlin",
        "Objective-C",
        "TypeScript",
        "jQuery",
        "Bootstrap",
        "WordPress",
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Oracle",
        "SQLite",
        "Microsoft SQL Server",
        "Firebase",
        "Elasticsearch",
        "Redis",
        "Git",
        "SVN",
        "Maven",
        "Gradle",
        "Docker",
        "Kubernetes",
        "Jenkins",
        "AWS",
        "Azure",
        "Google Cloud",
        "Heroku",
        "Apache Kafka",
        "RabbitMQ",
        "GraphQL",
        "RESTful API",
        "SOAP",
        "OAuth",
        "JSON",
        "XML",
        "JUnit",
        "Selenium",
        "Jest",
        "Cucumber",
        "Agile Methodologies",
        "Scrum",
        "Test-Driven Development (TDD)",
        "Continuous Integration and Deployment (CI/CD)",
        "DevOps",
        "Microservices",
        "Containerization",
        "Data Structures",
        "Algorithms",
        "Object-Oriented Programming (OOP)",
        "Functional Programming",
        "Design Patterns",
        "Software Development Life Cycle (SDLC)",
        "Problem-solving",
        "Debugging and Troubleshooting",
        "Code Review",
        "Collaboration and Teamwork",
        "Other"
      ]
    },
    {
      name: "Information Technology",
      skills: [ "Computer Science", "Technology Certification", "Professional Membership", "Technical and Analytical Skills", "Troubleshooting and Problem Solving", "Independent and Team Work", "Communication Skills","Microsoft Word","PowerPoint", "Learning and Adaptability","Other" ]
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