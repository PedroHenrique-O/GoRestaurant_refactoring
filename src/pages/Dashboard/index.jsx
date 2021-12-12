import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useState, useEffect } from "react";

function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState({});
  console.log("editingFood", editingFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const getFood = async () => {
      const response = await api.get("/foods");
      const data = response.data;
      console.log(data);

      setFoods(data);
    };

    getFood();
  }, []);

  const handleAddFood = async (food) => {
    //food é adicionado ao back-end junto com o available setado
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      //aqui setamos o response o prevState de food no state
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food) => {
    try {
      //aqui damos um put na rota foods/id
      //mandamos o food editado os prevStates
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });
      console.log("foodUpdated", foodUpdated);

      //aqui e feito um map, checamos se:
      //se o id do state não bater com o id do update, então:
      //retornamos o prevState, se sim o updated

      const foodsUpdated = foods.map((food) =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id) => {
    await api.delete(`/foods/${id}`);

    //se o food.id do state, for diferente do id do argumento
    //e gerado um novo array com as condições verdadeiras...

    const foodsFiltered = foods.filter((food) => food.id !== id);
    console.log("filtro", foodsFiltered);

    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food) => {
    console.log("handleEditFood", food);

    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods?.map((food) => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
