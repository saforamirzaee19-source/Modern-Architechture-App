import { useState } from "react";
import Icon from "./Icon.jsx";

function Field({ field, value, error, onChange }) {
  const id = `f-${field.name}`;
  return (
    <div className="stepform-field">
      <label htmlFor={id}>
        {field.label}
        {field.required && <span className="req"> *</span>}
      </label>
      {field.type === "select" ? (
        <select
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          aria-invalid={Boolean(error)}
        >
          <option value="" disabled>
            {field.placeholder ?? "Select"}
          </option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          id={id}
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={id}
          type={field.type ?? "text"}
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          aria-invalid={Boolean(error)}
        />
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function StepForm({
  title,
  subtitle,
  steps,
  initialValues = {},
  onFinish,
  finishLabel = "Save project",
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const current = steps[step];
  const stepValues = values[step] ?? {};

  const setField = (name, v) => {
    setValues((all) => ({ ...all, [step]: { ...all[step], [name]: v } }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    current.rows.flat().forEach((f) => {
      if (f.required && !String(stepValues[f.name] ?? "").trim())
        next[f.name] = `${f.label} is required.`;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step === steps.length - 1) {
      const merged = Object.assign({}, ...Object.values(values));
      onFinish?.(merged);
      setDone(merged);
    } else setStep(step + 1);
  };

  if (done) {
    return (
      <section className="stepform-card stepform-done">
        <span className="stepform-done-icon">
          <Icon name="check" size={28} />
        </span>
        <h2>Project saved</h2>
        <p>
          <strong>{done.projectName}</strong> was added to your workspace. Your
          project manager will confirm the schedule shortly.
        </p>
        <button
          className="btn-gold"
          type="button"
          onClick={() => {
            setDone(null);
            setValues(initialValues);
            setStep(0);
          }}
        >
          Add another project
        </button>
      </section>
    );
  }

  return (
    <section className="stepform-card">
      <header className="stepform-head">
        <p className="eyebrow">Project setup</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>

      <ol className="stepper">
        {steps.map((s, i) => (
          <li
            key={s.label}
            className={i === step ? "active" : i < step ? "done" : ""}
          >
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i >= step}
            >
              <span className="stepper-dot">
                {i < step ? <Icon name="check" size={14} /> : i + 1}
              </span>
              <span className="stepper-label">{s.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="stepform-body">
        <h2>{current.title}</h2>
        <p className="stepform-sub">{current.subtitle}</p>
        {current.rows.map((row, i) => (
          <div className="stepform-row" key={i}>
            {row.map((f) => (
              <Field
                key={f.name}
                field={f}
                value={stepValues[f.name]}
                error={errors[f.name]}
                onChange={setField}
              />
            ))}
          </div>
        ))}
      </div>

      <footer className="stepform-actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
        >
          Back
        </button>
        <button type="button" className="btn-gold" onClick={next}>
          {step === steps.length - 1 ? finishLabel : "Continue"}
        </button>
      </footer>
    </section>
  );
}
