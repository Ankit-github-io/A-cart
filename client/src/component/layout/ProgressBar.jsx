import React, { useEffect, useState } from "react";
import "./ProgressBar.css";

const ProgressBar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const percentage = (scrollPosition / maxScroll) * 100;
      setScrollPercentage(percentage);
    };

    // Attach the scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const isScrollbarVisible =
    document.documentElement.scrollHeight >
    document.documentElement.clientHeight;
  return (
    <div className="progress">
      <span
        className="bar"
        style={{ width: isScrollbarVisible ? `${scrollPercentage}%` : "0" }}
      ></span>
    </div>
  );
};

export default ProgressBar;
