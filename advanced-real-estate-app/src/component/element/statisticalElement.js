import { styled } from "@mui/material";
import { Slider } from "@mui/material";

export const BlueSliderBuildingStatistical = styled(Slider)(() => ({
  color: "blue",
  "& .MuiSlider-thumb": { backgroundColor: "#1C77BE" },
  "& .MuiSlider-track": { backgroundColor: "#1C77BE" },
  "& .MuiSlider-rail": { backgroundColor: "#1C77BE" },
  "& .MuiSlider-mark": { backgroundColor: "#1C77BE", height: 6, width: 4 },
  "& .MuiSlider-markLabel": { color: "rgba(0, 0, 0, 0.3)", fontSize: "12px" },
  "& .MuiSlider-valueLabel": { backgroundColor: "blue", color: "white" },
}));

export const GreenSliderBuildingStatistical = styled(Slider)(() => ({
  color: "#EF4444",
  "& .MuiSlider-thumb": { backgroundColor: "#EF4444" },
  "& .MuiSlider-track": { backgroundColor: "#EF4444" },
  "& .MuiSlider-rail": { backgroundColor: "#EF4444" },
  "& .MuiSlider-mark": { backgroundColor: "#EF4444", height: 6, width: 4 },
  "& .MuiSlider-markLabel": { color: "rgba(0, 0, 0, 0.5)", fontSize: "12px" },
  "& .MuiSlider-valueLabel": { backgroundColor: "#EF4444", color: "white" },
}));

export const PinkSliderBuildingStatistical = styled(Slider)(() => ({
  color: "#22C55E",
  "& .MuiSlider-thumb": { backgroundColor: "#22C55E" },
  "& .MuiSlider-track": { backgroundColor: "#22C55E" },
  "& .MuiSlider-rail": { backgroundColor: "#22C55E" },
  "& .MuiSlider-mark": { backgroundColor: "#22C55E", height: 6, width: 4 },
  "& .MuiSlider-markLabel": { color: "rgba(0, 0, 0, 0.5)", fontSize: "12px" },
  "& .MuiSlider-valueLabel": { backgroundColor: "#22C55E", color: "white" },
}));
