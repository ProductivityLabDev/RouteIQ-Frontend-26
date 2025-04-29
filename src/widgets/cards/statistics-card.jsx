import {
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

export function StatisticsCard({ title, value, outOf, footer }) {
  return (
    <Card className="rounded-[4px] shadow-md">
      <CardBody className="md:px-6 px-2 py-4 text-left space-y-5">
        <Typography className="font-bold text-xs md:text-[14px] text-[#0000]/70">
          {title}
        </Typography>
        <Typography className="font-extrabold text-base md:text-[24px] text-black">
          {value}<span className="text-xs md:text-[17px] text-black/50">{outOf}</span>
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 md:p-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default StatisticsCard;
