<script>
import moment from "moment";

const formatDatetime = (date) => {
  const dt = moment(date);
  return dt.format("YYYY/MM/DD HH:mm:ss");
};

const shortFormatDatetime = (date) => {
  const dt = moment(date);
  return dt.format("MM/DD");
};

export { formatDatetime, shortFormatDatetime };
</script>