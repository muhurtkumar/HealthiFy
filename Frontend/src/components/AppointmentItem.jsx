import { Link } from "react-router-dom";
import { ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

const AppointmentItem = ({ icon, title, subtitle, route }) => {
  return (
    <Link to={route} className="no-underline text-inherit">
      <ListItem className="cursor-pointer hover:bg-gray-100 rounded-lg p-3">
        <ListItemAvatar>
          <div className="text-gray-600">{icon}</div>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={subtitle}
          primaryTypographyProps={{ className: "font-medium" }}
        />
        <ListItemSecondaryAction>
          <ChevronRight className="text-gray-500" />
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  );
};

export default AppointmentItem;
