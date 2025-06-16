import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-4 bangers-regular">
      <p className="text-[#8B4513] text-3xl font-medium uppercase tracking-wide">
        {text1}
        <span className="text-[#aba4a1] font-semibold pl-2">{text2}</span>
      </p>
      {/* <div className="w-12 h-[2px] bg-[#8B4513]"></div> */}
    </div>
  );
};

export default Title;
