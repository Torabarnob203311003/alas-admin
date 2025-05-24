import React from "react";
import { FaEdit } from "react-icons/fa";

export default function Card({ card, onEditClick }) {
  return (
    <div className="bg-white border border-zinc-400  rounded-lg overflow-hidden relative p-2  shadow-sm hover:shadow-md transition-shadow  ">
      <div className="overflow-hidden rounded-lg">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-56 object-cover rounded-lg"
        />
      </div>
      <div className=" pt-4 pb-2 px-4">
        <h2 className="text-lg font-semibold mb-1 text-gray-900">
          {card.title}
        </h2>
        {card.description && (
          <p className="text-sm text-gray-600 mb-2 truncate">
            {card.description}
          </p>
        )}

        <p className="text-sm text-gray-500">
          {card.count} {card.title}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onEditClick(card)}
        className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 p-2 rounded-lg text-white transition"
        aria-label={`Edit ${card.title}`}
      >
        <FaEdit />
      </button>
    </div>
  );
}
