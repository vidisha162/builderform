import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const initialForm = {
  comprehension: [
    {
      paragraph:
        "The Amazon rainforest is the largest tropical rainforest in the world. It helps regulate the Earth's oxygen and carbon cycles.",
      question:
        "What is the primary environmental benefit of the Amazon rainforest?",
      options: [
        "It produces petroleum",
        "It regulates oxygen and carbon cycles",
        "It causes floods",
      ],
      answer: "It regulates oxygen and carbon cycles",
    },
  ],
  cloze: [
    {
      text: "Water boils at ______ degrees Celsius.",
      answer: "100",
    },
  ],
  categorize: [
    {
      categories: ["Fruit", "Vegetable", "Animal"],
      items: [
        { id: "1", name: "Apple", category: "Fruit" },
        { id: "2", name: "Carrot", category: "Vegetable" },
        { id: "3", name: "Tiger", category: "Animal" },
      ],
    },
  ],
};

const FormBuilder = () => {
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("");
  const [form, setForm] = useState(initialForm);
  const [columns, setColumns] = useState({});
  const [newQType, setNewQType] = useState("comprehension");
  const [newQData, setNewQData] = useState({
    paragraph: "",
    question: "",
    options: ["", "", ""],
    answer: "",
    clozeText: "",
    clozeAnswer: "",
    categories: "",
    items: "",
  });

  useEffect(() => {
    const categorize = form.categorize[form.categorize.length - 1];
    if (categorize) {
      const cats = categorize.categories;
      const items = categorize.items;
      const col = {
        Unassigned: items,
        ...Object.fromEntries(cats.map((cat) => [cat, []])),
      };
      setColumns(col);
    }
  }, [form.categorize]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceItems = Array.from(columns[source.droppableId]);
    const destItems = Array.from(columns[destination.droppableId]);
    const [movedItem] = sourceItems.splice(result.source.index, 1);
    destItems.splice(result.destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });
  };

  const addNewQuestion = () => {
    if (newQType === "comprehension") {
      const newComp = {
        paragraph: newQData.paragraph,
        question: newQData.question,
        options: newQData.options,
        answer: newQData.answer,
      };
      setForm((prev) => ({
        ...prev,
        comprehension: [...prev.comprehension, newComp],
      }));
    } else if (newQType === "cloze") {
      setForm((prev) => ({
        ...prev,
        cloze: [
          ...prev.cloze,
          { text: newQData.clozeText, answer: newQData.clozeAnswer },
        ],
      }));
    } else if (newQType === "categorize") {
      const cats = newQData.categories.split(",").map((c) => c.trim());
      const items = newQData.items.split(",").map((i, idx) => {
        const [name, category] = i.split(":");
        return {
          id: `${Date.now()}-${idx}`,
          name: name.trim(),
          category: category.trim(),
        };
      });

      const newColumns = {
        Unassigned: items,
        ...Object.fromEntries(cats.map((c) => [c, []])),
      };

      setForm((prev) => ({
        ...prev,
        categorize: [...prev.categorize, { categories: cats, items }],
      }));
      setColumns(newColumns);
    }

    setNewQData({
      paragraph: "",
      question: "",
      options: ["", "", ""],
      answer: "",
      clozeText: "",
      clozeAnswer: "",
      categories: "",
      items: "",
    });
  };

  const saveForm = async () => {
    try {
      await axios.post("http://localhost:5000/api/forms", {
        title: formTitle,
        fields: form,
      });
      navigate("/thankyou");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Form Builder</h1>

      {/* Form Title Input */}
      <input
        type="text"
        placeholder="Enter Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        className="mb-6 p-2 w-full bg-gray-800 border border-gray-700 rounded"
      />

      {/* Add New Question */}
      <div className="mb-10 bg-gray-900 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Question</h2>
        <select
          className="mb-4 p-2 bg-gray-800 border border-gray-700 rounded"
          value={newQType}
          onChange={(e) => setNewQType(e.target.value)}
        >
          <option value="comprehension">Comprehension</option>
          <option value="cloze">Cloze</option>
          <option value="categorize">Categorize</option>
        </select>

        {newQType === "comprehension" && (
          <>
            <textarea
              placeholder="Paragraph"
              className="block mb-2 w-full p-2 bg-gray-800 border border-gray-700 rounded"
              value={newQData.paragraph}
              onChange={(e) =>
                setNewQData({ ...newQData, paragraph: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Question"
              className="block mb-2 w-full p-2 bg-gray-800 border border-gray-700 rounded"
              value={newQData.question}
              onChange={(e) =>
                setNewQData({ ...newQData, question: e.target.value })
              }
            />
            {newQData.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                className="block mb-2 w-full p-2 bg-gray-800 border border-gray-700 rounded"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...newQData.options];
                  newOptions[i] = e.target.value;
                  setNewQData({ ...newQData, options: newOptions });
                }}
              />
            ))}
            <input
              type="text"
              placeholder="Correct Answer"
              className="block mb-2 w-full p-2 bg-gray-800 border border-gray-700 rounded"
              value={newQData.answer}
              onChange={(e) =>
                setNewQData({ ...newQData, answer: e.target.value })
              }
            />
          </>
        )}

        {newQType === "cloze" && (
          <>
            <input
              type="text"
              placeholder="Cloze Text (use ____ for blank)"
              className="block mb-2 w-full p-2 bg-gray-800 border border-gray-700 rounded"
              value={newQData.clozeText}
              onChange={(e) =>
                setNewQData({ ...newQData, clozeText: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Correct Answer"
              className="block mb-2 w-full p-2 bg-gray-800 border border-gray-700 rounded"
              value={newQData.clozeAnswer}
              onChange={(e) =>
                setNewQData({ ...newQData, clozeAnswer: e.target.value })
              }
            />
          </>
        )}

        {newQType === "categorize" && (
          <>
            <input
              type="text"
              placeholder="Categories (comma separated)"
              className="block mb-2 w-full p-2 bg-gray-800 border border-gray-700 rounded"
              value={newQData.categories}
              onChange={(e) =>
                setNewQData({ ...newQData, categories: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Items (e.g. Apple:Fruit, Carrot:Vegetable)"
              className="block mb-2 w-full p-2 bg-gray-800 border border-gray-700 rounded"
              value={newQData.items}
              onChange={(e) =>
                setNewQData({ ...newQData, items: e.target.value })
              }
            />
          </>
        )}

        <button
          className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          onClick={addNewQuestion}
        >
          Add Question
        </button>
      </div>

      {/* Render Comprehension Questions */}
      {form.comprehension.map((comp, index) => (
        <div key={index} className="mb-6 p-4 bg-gray-900 rounded">
          <h2 className="text-lg font-semibold mb-2">Comprehension {index + 1}</h2>
          <p className="mb-2">{comp.paragraph}</p>
          <p className="font-medium mb-1">Q: {comp.question}</p>
          {comp.options.map((opt, idx) => (
            <div key={idx} className="mb-1">
              <input type="radio" name={`comp-${index}`} className="mr-2" />
              {opt}
            </div>
          ))}
        </div>
      ))}

      {/* Render Cloze Questions */}
      {form.cloze.map((clz, index) => (
        <div key={index} className="mb-6 p-4 bg-gray-900 rounded">
          <h2 className="text-lg font-semibold mb-2">Cloze {index + 1}</h2>
          <p>{clz.text}</p>
          <input
            type="text"
            className="mt-2 p-2 w-full bg-gray-800 border border-gray-700 rounded"
            placeholder="Your answer"
          />
        </div>
      ))}

      {/* Render Categorize Section */}
      {Object.keys(columns).length > 0 && (
        <div className="p-4 bg-gray-900 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">Categorize</h2>
          <p className="mb-4">Drag the items to the correct category:</p>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(columns).map(([category, items]) => (
                <Droppable key={category} droppableId={category}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[100px] p-2 bg-gray-800 border border-gray-700 rounded"
                    >
                      <h3 className="text-center text-md font-bold">{category}</h3>
                      {items.map((item, idx) => (
                        <Draggable key={item.id} draggableId={item.id} index={idx}>
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
          <div className="mt-8 text-center">
            <Link to="/preview">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
                Preview Form
              </button>
            </Link>
            <button
              onClick={saveForm}
              className="ml-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
            >
              Save Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;