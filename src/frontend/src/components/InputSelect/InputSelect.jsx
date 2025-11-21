import PropTypes from "prop-types";
import { FormControl, Select, MenuItem } from "@mui/material";

const InputSelect = ({ value, options, onChange, placeholder }) => (
  <FormControl fullWidth>
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      variant="outlined"
      renderValue={(v) => (v ? v : placeholder)}
      sx={{
        height: 44,
        borderRadius: 9999,
        bgcolor: "white",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#39A348", // verde borde
          borderWidth: 3,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#2E8C3B",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#2E8C3B",
        },
        px: 2, // padding horizontal
        fontSize: 18,
      }}
      MenuProps={{
        PaperProps: { sx: { borderRadius: 2 } },
      }}
    >
        {options.map((option, idx) => (
          <MenuItem key={idx} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
    </Select>
  </FormControl>
);

export default InputSelect;

InputSelect.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};