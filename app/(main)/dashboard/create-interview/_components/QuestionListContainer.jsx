import React from 'react'

const QuestionListContainer = ({ questionList }) => {
  return (
    <div>
      {questionList.map((item, index) => (
        <div
          key={index}
          className="
            group p-4 rounded-xl border border-gray-200 bg-white
            shadow-sm transition-all duration-300
            hover:shadow-lg hover:-translate-y-1 hover:border-primary
          "
        >
          <div className="flex items-start justify-between">
            <h2 className="
              text-lg font-semibold text-gray-800
              group-hover:text-primary transition-colors
            ">
              {item.question}
            </h2>

            <span
              className="
                ml-4 px-3 py-1 text-xs font-medium rounded-full
                bg-primary/10 text-primary
                group-hover:bg-primary group-hover:text-white
                transition-colors
              "
            >
              {item?.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuestionListContainer
