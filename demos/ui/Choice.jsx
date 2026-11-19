import { Segmented } from '@svar-ui/react-core';
import { useWritableProp } from '@svar-ui/lib-react';

// One-of-few switch (view mode, size, locale).
function Choice({ options, value: valueProp, onChange }) {
  const [value, setValue] = useWritableProp(valueProp);

  function change(ev) {
    setValue(ev.value);
    onChange && onChange(ev);
  }

  return (
    <Segmented
      options={options}
      value={value}
      onChange={change}
      css="wx-demo-choice"
    />
  );
}

export default Choice;
