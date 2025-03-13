import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export const AlertWarningIconTooltip = (props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = props.icon;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Icon
        style={props?.cssIcon}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            fontSize: "12px",
            zIndex: 10,
          }}
        >
          {props?.message}
        </div>
      )}
    </div>
  );
};
