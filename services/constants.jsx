import { Calendar, LayoutDashboard ,List,WalletCards,Settings, Code2Icon, BriefcaseBusinessIcon,User2Icon,Puzzle} from "lucide-react"


export const SideBarOptions=[
    {
        name:'Dashboard',
        icon:LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:'Billing',
        icon:WalletCards,
        path:'/billing'
    },
    {
        name:'Settings',
        icon:Settings,
        path:'/settings'
    }
]

export const InterviewType=[
    {
       title:'Technical',
       icon: Code2Icon
    },
    {
       title:'Behavioral',
       icon: User2Icon
    },
   {
       title:'Experience',
       icon: BriefcaseBusinessIcon
    },
    {
       title:'Problem Solving',
       icon: Puzzle
    }


]    

// export const QUESTION_PROMPT=
// `You are an expert technical interviewer.

// Based on the following inputs, generate a well-structured list of high-quality interview questions:

// Job Title: {{jobTitle}}
// Job Description: {{jobDescription}}
// Interview Duration: {{duration}}
// Interview Type: {{type}}

// Your task:
// - Analyze the job description to identify key responsibilities, required skills, and expected experience.
// - Generate a list of interview questions depending on interview duration.
// - Adjust the number and depth of questions to match the interview duration.
// - Ensure the questions match the tone and structure of a real-life {{type}} interview.

// Format your response in JSON format with an array list of questions.

// Format:
// {
//   interviewQuestions = [
//     {
//       question: "",
//       type: "Technical / Behavioral / Experience / Problem Solving / Leadership"
//     }
//   ]
// }

// The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role`


export const QUESTION_PROMPT = `
You are an expert technical interviewer.

Based on the following inputs, generate a well-structured list of high-quality interview questions.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate interview questions based on the interview duration.
- Adjust the number and depth of questions to match the duration.
- Ensure the questions reflect a real-life {{type}} interview.

IMPORTANT:
- Respond ONLY in valid JSON
- Do NOT include explanations, markdown, or extra text

JSON Format:
{
  "interviewQuestions": [
    {
      "question": "string",
      "type": "Technical | Behavioral | Experience | Problem Solving | Leadership"
    }
  ]
}

The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
`;
