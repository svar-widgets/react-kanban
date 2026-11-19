import { Slider } from '@svar-ui/react-core';
import { useWritableProp } from '@svar-ui/lib-react';
import './RangeInput.css';

// Slider with an inline caption and the current value.
function RangeInput({
  label,
  value: valueProp = 0,
  min = 0,
  max = 100,
  step = 1,
  width = '160px',
  onChange,
}) {
  const [value, setValue] = useWritableProp(valueProp);

  function change(ev) {
    setValue(ev.value);
    onChange && onChange(ev);
  }

  return (
    <div className="wx-demo-range">
      <span className="wx-demo-range-label">{label}</span>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        width={width}
        onChange={change}
      />
      <span className="wx-demo-range-value">{value}</span>
    </div>
  );
}

export default RangeInput;
