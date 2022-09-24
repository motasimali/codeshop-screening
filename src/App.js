import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

const fieldTemp = { sign: "+", value: "", disabled: false };

function App() {
  const [result, setResult] = useState(0);
  const [fields, setFields] = useState([
    { sign: "+", value: "", disabled: false },
  ]);
  let elRefs = useRef([]);

  useEffect(() => {
    calculateResult();
  }, [fields]);

  const evaluteString = (fn) => {
    return new Function("return " + fn)();
  };

  const calculateResult = () => {
    let eq = "0";
    fields.forEach((field, index) => {
      if (field.disabled === false) {
        if (index === 0) {
          if (field.sign === "-") {
            eq = `-${parseFloat(field.value)}`;
          } else {
            eq = parseFloat(field.value);
          }
        } else {
          let val = 0;
          if (field.value) {
            val = parseFloat(field.value);
          }
          eq = `${eq}${field.sign}${val}`;
        }
      }
    });
    setResult(eq ? evaluteString(eq) : 0);
  };
  const handleFieldStatusChange = (e, index) => {
    setFields([
      ...fields.map((field, ind) => {
        if (ind === index) {
          field.disabled = e;
        }
        return field;
      }),
    ]);
  };
  const handleFieldSignChange = (e, index) => {
    setFields([
      ...fields.map((field, ind) => {
        if (ind === index) {
          field.sign = e;
        }
        return field;
      }),
    ]);
  };
  const handleFieldValChange = (e, index) => {
    e.preventDefault();
    setFields(
      [...fields].map((field, ind) => {
        if (ind === index) {
          return {
            ...field,
            value:
              !!e.target.value && Math.abs(e.target.value) >= 0
                ? Math.abs(e.target.value)
                : 0,
          };
        }
        return field;
      })
    );
  };

  const addRow = () => {
    setFields([...fields, fieldTemp]);
  };

  const removeRow = (index) => {
    setFields([...fields.filter((field, ind) => ind !== index)]);
    calculateResult();
  };
  return (
    <div className="App">
      <header className="App-header">
        <button className="button" onClick={addRow}>
          Add Row
        </button>
        <ul>
          {fields.map((field, index) => {
            return (
              <li key={index}>
                <select
                  className="select"
                  defaultValue={field.sign}
                  onChange={(e) => handleFieldSignChange(e.target.value, index)}
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                </select>

                <input
                  className="input"
                  ref={(el) => (elRefs.current = [...elRefs.current, el])}
                  key={index}
                  disabled={field.disabled}
                  value={field.value}
                  onChange={(e) => handleFieldValChange(e, index)}
                />
                <button className="button" onClick={() => removeRow(index)}>
                  Delete
                </button>
                {field.disabled ? (
                  <button
                    className="button"
                    onClick={(e) => handleFieldStatusChange(false, index)}
                  >
                    Enable
                  </button>
                ) : (
                  <button
                    className="button"
                    onClick={() => handleFieldStatusChange(true, index)}
                  >
                    Disable
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        Result: {result}
      </header>
    </div>
  );
}

export default App;
