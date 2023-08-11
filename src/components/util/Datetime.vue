<script lang="ts">
import moment from "moment";

const formatDatetime = (date: Date) => {
  const dt = moment(date);
  return dt.format("YYYY-MM-DD hh:mm:ss");
};

export { formatDatetime };
</script>