import React, { useState } from 'react';
import './FormattedLogLine.css';

const FormattedLogLine = ({ line }) => {
  const [collapsed, setCollapsed] = useState(true);
  const maxLength = 150;

  const getColorClass = () => {
    if (/error|fail/i.test(line)) return 'log-error';
    if (/warn/i.test(line)) return 'log-warn';
    if (/info/i.test(line)) return 'log-info';
    return 'log-default';
  };

  const toggleCollapse = () => setCollapsed(!collapsed);

  const isLong = line.length > maxLength;

  return (
    <div className={`log-line ${getColorClass()}`}>
      {isLong ? (
        <span onClick={toggleCollapse} className="collapsible">
          {collapsed ? line.slice(0, maxLength) + '...' : line}
        </span>
      ) : (
        line
      )}
    </div>
  );
};

export default FormattedLogLine;
