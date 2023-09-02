<script lang="ts">
import moment from "moment";

const formatDatetime = (date: Date) => {
  const dt = moment(date);
  return dt.format("YYYY/MM/DD hh:mm:ss");
};

const shortFormatDatetime = (date: Date) => {
  const dt = moment(date);
  return dt.format("MM/DD");
};

export { formatDatetime, shortFormatDatetime };
</script>