import { useState } from "react";
import { Link } from "react-router-dom"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialForm = {
  comprehension: {
    paragraph:
      "The Amazon rainforest, also known as Amazonia, is a vast tropical rainforest in South America. It is home to an incredible diversity of plant and animal species. The forest plays a vital role in regulating the Earth's climate by absorbing large amounts of carbon dioxide.",
    question:
      "What important role does the Amazon rainforest play in the Earth's climate?",
    options: [
      "It produces petroleum",
      "It reflects sunlight",
      "It absorbs carbon dioxide",
    ],
    answer: "It absorbs carbon dioxide",
  },
  cloze: {
    text: "The process of converting water vapor into liquid is called ______.",
    answer: "condensation",
  },
  categorize: {
    categories: ["Fruit", "Vegetable", "Meat"],
    items: [
      { id: "1", name: "Apple", category: "Fruit" },
      { id: "2", name: "Carrot", category: "Vegetable" },
      { id: "3", name: "Chicken", category: "Meat" },
    ],
  },
};

const FormPreview = () => {
  const [answers, setAnswers] = useState({
    comprehension: "",
    cloze: "",
    categorize: {
      Fruit: [],
      Vegetable: [],
      Meat: [],
      Unassigned: initialForm.categorize.items,
    },
  });

  const handleComprehensionChange = (val) => {
    setAnswers((prev) => ({
      ...prev,
      comprehension: val,
    }));
  };

  const handleClozeChange = (e) => {
    setAnswers((prev) => ({
      ...prev,
      cloze: e.target.value,
    }));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceItems = Array.from(answers.categorize[source.droppableId]);
    const destItems = Array.from(answers.categorize[destination.droppableId]);
    const [movedItem] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, movedItem);

    setAnswers((prev) => ({
      ...prev,
      categorize: {
        ...prev.categorize,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      },
    }));
  };

  const handleSubmit = () => {
    console.log("User Answers:", answers);
    alert("Answers submitted! Check console.");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Form Preview</h1>

      {/* Comprehension */}
      <div className="mb-10 p-4 bg-gray-900 rounded">
        <h2 className="text-xl font-semibold mb-2">1. Comprehension</h2>
        <p className="mb-2">{initialForm.comprehension.paragraph}</p>
        <p className="mb-1 font-medium">Q: {initialForm.comprehension.question}</p>
        <form>
          {initialForm.comprehension.options.map((opt, idx) => (
            <div key={idx} className="mb-1">
              <input
                type="radio"
                id={`opt-${idx}`}
                name="comp"
                className="mr-2"
                value={opt}
                onChange={(e) => handleComprehensionChange(e.target.value)}
              />
              <label htmlFor={`opt-${idx}`}>{opt}</label>
            </div>
          ))}
        </form>
      </div>

      {/* Cloze */}
      <div className="mb-10 p-4 bg-gray-900 rounded">
        <h2 className="text-xl font-semibold mb-2">2. Cloze</h2>
        <p>{initialForm.cloze.text}</p>
        <input
          type="text"
          placeholder="Your answer"
          value={answers.cloze}
          onChange={handleClozeChange}
          className="mt-2 p-2 bg-gray-800 text-white border border-gray-700 rounded"
        />
      </div>

      {/* Categorize with drag-and-drop */}
      <div className="p-4 bg-gray-900 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Categorize</h2>
        <p className="mb-4">Drag the items to the correct category:</p>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(answers.categorize).map(([category, items]) => (
              <Droppable key={category} droppableId={category}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[100px] p-2 bg-gray-800 border border-gray-700 rounded"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-center">{category}</h3>
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-2 mb-2 bg-gray-700 rounded text-center"
                          >
                            {item.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
      >
        Submit Answers
      </button>

      <Link to="/thankyou">
  <button className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium">
    Submit Form
  </button>
</Link>
    </div>
  );
};

export default FormPreview;

