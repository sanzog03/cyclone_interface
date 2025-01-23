import { Paper, Typography, Divider } from "@mui/material";

import "./index.css";

export const Title = ({ children }) => {
    return (
        <Paper className="title-container">
            <Typography
                variant="h6"
                component="div"
                className="title-head"
                fontWeight="bold"
                sx={{margin: "0 0.9rem"}}
            >
                Cyclone Interface - Data Portal
            </Typography>
            <Typography
                variant="body2"
                component="div"
                className="title-note"
                sx={{margin: "0 0.9rem", color: "text.secondary"}}
            >
            </Typography>
            <Divider
                sx={{
                    borderColor: "var(--main-blue)",
                    borderWidth: "1px",
                    margin: "0.3rem 1.4rem",
                }}
            />
            <div className="title-content">
                { children }
            </div>
        </Paper>
    )
}
