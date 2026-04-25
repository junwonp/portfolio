<script lang="ts">
  interface Props {
    dateFrom: string;
    dateTo?: string;
  }

  let { dateFrom, dateTo }: Props = $props();

  const timeFormatter = (time?: string) => {
    if (!time) return '';
    const [year, month = ''] = time.split('-');
    return `${year}. ${month}`;
  };
</script>

<span
  ><time datetime={dateFrom}>{timeFormatter(dateFrom)}</time
  >{#if dateFrom.includes('-') && (!dateTo || dateTo !== dateFrom)}
    ~
  {/if}{#if dateTo && dateTo !== dateFrom}<time datetime={dateTo}>{timeFormatter(dateTo)}</time
    >{/if}</span
>
