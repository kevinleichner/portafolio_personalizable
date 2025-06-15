import { HexColorPicker } from "react-colorful";
import { useState, useEffect } from "react";

export const SelectorColor = ({ colorInicial = "#ffffff", onChange }) => {
  const [color, setColor] = useState(colorInicial);

  useEffect(() => {
    setColor(colorInicial);
  }, [colorInicial]);

  const handleChange = (nuevoColor) => {
    setColor(nuevoColor);
    onChange(nuevoColor);
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2 rounded-md bg-white shadow">
      <HexColorPicker color={color} onChange={handleChange} />
      <input
        type="text"
        value={color}
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded px-2 py-1 text-center w-[120px]"
      />
    </div>
  );
};
