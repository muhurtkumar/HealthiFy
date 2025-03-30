import { Grid } from "@mui/material";
import ProfileFormField from "./ProfileFormField";
import { profileFieldDefinitions } from "./ProfileFormManager";

// Personal information form component
const ProfilePersonalInfoForm = ({ 
  profileData, 
  handleFieldChange, 
  isEditMode
}) => {
  return (
    <Grid container spacing={3}>
      {profileFieldDefinitions.personalInfo.map((fieldDefinition) => (
        <ProfileFormField
          key={fieldDefinition.name}
          field={fieldDefinition}
          formData={profileData}
          handleChange={handleFieldChange}
          isEditing={isEditMode}
        />
      ))}
    </Grid>
  );
};

export default ProfilePersonalInfoForm; 