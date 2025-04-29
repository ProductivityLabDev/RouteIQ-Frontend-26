export const chartConfig = {
  type: "bar",
  height: 225,
  series: [
    {
      name: "Attendance",
      data: [280, 120, 300, 320, 400, 350, 200, 230, 400, 140, 300, 320],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#C01824"],
    plotOptions: {
      bar: {
        columnWidth: "28%",
        borderRadius: 7,
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#838383",
          fontSize: "9px",
          fontFamily: "inherit",
          fontWeight: 500,
        },
      },
      categories: [
        "Jan",
        "Feb",
        "March",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#838383",
          fontSize: "10px",
          fontFamily: "inherit",
          fontWeight: 700,
        },
      },
    },
    grid: {
      show: false,
    },

    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "light",
    },
  },
};

export default chartConfig;
