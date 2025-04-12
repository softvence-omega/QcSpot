import { useState } from "react";
import { ICategoryRestriction, IShippingData } from "../types/estimation.type";

const EstimationCard = ({ data }: { data: IShippingData }) => {
  const {
    name,
    iconUrl,
    features,
    transitTime,
    available,
    restrictions,
    feeDetail,
  } = data;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <div
        className={`flex flex-col md:flex-row justify-normal md:justify-between items-start md:items-center gap-5 shadow-sm p-4 rounded-lg border dark:border-shadow ${
          !available ? "cursor-not-allowed opacity-40" : "cursor-pointer"
        }`}
        onClick={() => available && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-5">
          <img className="w-12 h-12 rounded-full" src={iconUrl} alt={name} />
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-zinc-500">
              Shipping Fee:{" "}
              <span className="text-xl text-red-500 font-semibold">
                {feeDetail?.currencyEnum?.symbol}
                {feeDetail?.total}
              </span>
            </p>
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

      {/* Details section */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? "mt-4" : "max-h-0"
        }`}
      >
        <div className="p-4 border rounded-lg shadow-sm bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
          {/* Parcel Restrictions */}
          <h2 className="text-lg font-semibold mb-2">Parcel Restrictions:</h2>
          <div className="p-3 pt-5 rounded-lg border dark:border-shadow space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-300">
              <span className="font-semibold mr-2">Weight Restriction:</span>
              {restrictions?.minWeight}g -{restrictions?.maxWeight}g
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-300">
              <span className="font-semibold mr-2">
                Dimension Restriction:{" "}
              </span>{" "}
              {restrictions?.dimensionRestriction}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-300">
              <span className="font-semibold mr-2">
                Billing Rules of Volumetric Weight:{" "}
              </span>
              {restrictions?.volumeWeightRule}
            </p>
            <div className="border-b border-b-gray-300 w-full pb-3"></div>

            {/* Restrictions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                {/* head */}
                <thead>
                  <tr className="bg-zinc-200 dark:bg-zinc-700 border-b dark:border-zinc-700">
                    <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                      Category
                    </th>
                    <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                      Can Send
                    </th>
                    <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                      Cannot Send
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {restrictions?.categoryRestrictions &&
                    restrictions?.categoryRestrictions?.map(
                      (r: ICategoryRestriction, index: number) => (
                        <tr
                          key={index}
                          className="bg-white dark:bg-black border-b dark:border-zinc-700"
                        >
                          <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                            {r.name}
                          </td>
                          <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                            {r.allowList?.join(", ")}
                          </td>
                          <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                            {r.blockList?.join(", ")}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charge Standard */}
          <h2 className="text-lg font-semibold mt-5 mb-2">Charge Standard:</h2>
          {/* Standard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
              <thead>
                <tr className="bg-zinc-200 dark:bg-zinc-700 border-b dark:border-zinc-700">
                  <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    First Weight Price
                  </th>
                  <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    Continued Weight Price
                  </th>
                  <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    Customs and Declaration Fee
                  </th>
                  <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    Air Surcharge
                  </th>
                  <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    Fuel Fee
                  </th>
                  <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    Service Fee
                  </th>
                  <th className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    Shipping Fee
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white dark:bg-black border-b dark:border-zinc-700">
                  <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    {feeDetail?.currencyEnum?.symbol}
                    {feeDetail?.feeFirst} / {feeDetail?.weightFirst} g
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    {feeDetail?.currencyEnum?.symbol}
                    {feeDetail?.feeContinue} / {feeDetail?.weightContinue} g
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    {feeDetail?.currencyEnum?.symbol}
                    {feeDetail?.customsFee}
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    {feeDetail?.currencyEnum?.symbol}
                    {feeDetail?.airSurcharge}
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    {feeDetail?.currencyEnum?.symbol}
                    {feeDetail?.fuelFee}
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    {feeDetail?.currencyEnum?.symbol}
                    {feeDetail?.serviceFee}
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-700 px-2 py-2">
                    {feeDetail?.currencyEnum?.symbol}
                    {feeDetail?.chargeableWeight}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationCard;
