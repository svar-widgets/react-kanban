import { useId } from 'react';
import { Switch } from '@svar-ui/react-core';
import { useWritableProp } from '@svar-ui/lib-react';
import './Toggle.css';

// Switch with a clickable caption on its right.
function Toggle({
  label,
  value: valueProp = false,
  disabled = false,
  onChange,
}) {
  const id = useId();
  const [value, setValue] = useWritableProp(valueProp);

  function change(ev) {
    setValue(ev.value);
    onChange && onChange(ev);
  }

  return (
    <div className={`wx-demo-toggle${disabled ? ' wx-disabled' : ''}`}>
      <Switch id={id} value={value} disabled={disabled} onChange={change} />
      <label className="wx-demo-toggle-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default Toggle;
