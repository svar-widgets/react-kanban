import { Select } from '@svar-ui/react-core';
import { useWritableProp } from '@svar-ui/lib-react';
import './SelectBox.css';

// One-of-many dropdown with a fixed width, so toolbars do not jump.
function SelectBox({
  options,
  value: valueProp,
  width = '180px',
  placeholder,
  onChange,
}) {
  const [value, setValue] = useWritableProp(valueProp);

  function change(ev) {
    setValue(ev.value);
    onChange && onChange(ev);
  }

  return (
    <div className="wx-demo-select" style={{ '--wx-input-width': width }}>
      <Select
        options={options}
        value={value}
        placeholder={placeholder}
        onChange={change}
      />
    </div>
  );
}

export default SelectBox;
