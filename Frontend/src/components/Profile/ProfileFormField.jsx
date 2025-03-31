import { Grid, TextField, MenuItem } from "@mui/material";

// A reusable form field component for profile information
const ProfileFormField = ({ 
  field, 
  formData, 
  handleChange, 
  isEditing 
}) => {
  const {
    name,
    label,
    type = "text",
    xs = 12,
    sm,
    options,
    multiline,
    rows,
    disabled,
    className,
    ...otherProps
  } = field;

  // Determine if the field should be disabled
  const isFieldDisabled = disabled === true || !isEditing;
  
  // Use filled variant for read-only fields, outlined for editable fields
  const fieldVariant = isFieldDisabled ? "filled" : "outlined";

  return (
    <Grid item xs={xs} sm={sm} className={className}>
      <TextField
        fullWidth
        name={name}
        label={label}
        type={type}
        value={formData[name] || ""}
        onChange={handleChange}
        disabled={isFieldDisabled}
        variant={fieldVariant}
        select={Boolean(options)}
        multiline={multiline}
        rows={rows}
        InputProps={{ readOnly: isFieldDisabled }}
        InputLabelProps={type === "date" ? { shrink: true } : undefined}
        className="rounded shadow-sm"
        {...otherProps}
      >
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
};

export default ProfileFormField; 