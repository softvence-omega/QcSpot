import { IShippingData } from "../types/estimation.type";

const EstimationCard = ({ data }: { data: IShippingData }) => {
  const { name, iconUrl, features, transitTime, available } = data;
  console.log(data);
  return (
    <div
      className={`flex flex-col md:flex-row justify-normal md:justify-between items-start md:items-center gap-5 shadow-sm p-4 rounded-lg border dark:border-shadow mb-4 ${
        !available ? "cursor-not-allowed opacity-40" : "cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-5">
        <img className="w-12 h-12 rounded-full" src={iconUrl} alt={name} />
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-zinc-500">Shipping Fee: </p>
        </div>
      </div>

      <div>
        <p className="text-sm text-zinc-500">Transit Time:</p>
        <p className="flex gap-1 items-center">
          <span className="font-semibold">{transitTime}</span>
          <span className="text-zinc-500 text-sm">days</span>
        </p>
      </div>
      <div>
        <p className="text-sm md:max-w-xs lg:max-w-md text-zinc-500 ml-1">
          {features}
        </p>
      </div>
    </div>
  );
};

export default EstimationCard;
