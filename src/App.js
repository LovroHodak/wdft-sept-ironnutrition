import React, { Component } from 'react'
import 'bulma/css/bulma.css';
import foods from './foods.json';
import FoodBox from './components/FoodBox';
import AddFood from './components/AddFood';


 class App extends Component {

  state = {
    foodList: foods,
    filteredList: foods,
    showForm: false,
    totalCalorieFoods: []
  }

  toggleForm = () => {
    this.setState({
      showForm: true
    })
  }

  handleAdd = (e) => {
    e.preventDefault()
    // let name = e.target.name.value
    // let calories = e.target.calories.value
    // let image = e.target.image.value
    const {name, calories, image} = e.target
    let newFood = {
      name: name.value,
      calories: calories.value,
      image: image.value,
      quantity: 0
    }

    this.setState({
      foodList: [newFood, ...this.state.foodList],
      showForm: false
    })

  }

  handleSearch = (e) => {
    let searchText = e.target.value
    let filteredList = this.state.foodList.filter((food) => {
      return food.name.toLowerCase().startsWith(searchText.toLowerCase())
    })

    this.setState({
      filteredList
    })

  }

  handleAddCalories = (food, quantity) => {
    
    let foodIndex = this.state.totalCalorieFoods.findIndex((item) => {
        return item.name == food.name
    })

    if (foodIndex !== -1 ) {
      // food exists
      let cloneList = JSON.parse(JSON.stringify(this.state.totalCalorieFoods))
      cloneList[foodIndex].quantity += quantity

      this.setState({
        totalCalorieFoods: cloneList
      })

    }
    else {
      // food does not exist

      let myFood = {
        name: food.name, 
        calories: food.calories,
        quantity: quantity
      }
  
      this.setState({
        totalCalorieFoods: [...this.state.totalCalorieFoods, myFood]
      })
    }
  }

  handleDelete = (name) => {
    const {totalCalorieFoods} = this.state
    let newTotalCalorieFoods = totalCalorieFoods.filter((food) => {
      return  food.name != name
    })

    this.setState({
      totalCalorieFoods: newTotalCalorieFoods
    })
  }

  render() {
    const { foodList, showForm, filteredList, totalCalorieFoods} = this.state

    let totalCalories = totalCalorieFoods.reduce((acc, food) => {
        return acc + (food.calories * food.quantity)
    }, 0)


    return (
      <div className="columns">
        <div className="column">
        {
          showForm ? (
            <AddFood onAdd={this.handleAdd} />
          ) : (
            <button onClick={this.toggleForm} >Show From</button>
          )
        }
        <input onChange={this.handleSearch} type="text" placeholder="Search"></input>
        {
          filteredList.map((food, i) => {
            return <FoodBox 
                key={i} 
                singleFood={food}
                onAdd={this.handleAddCalories}
                />
          })
        }
        </div>
        <div className="column">
          Total Calories
          <ul>
            {
              totalCalorieFoods.map((food, i) => {
              return <li>
                <p>{food.quantity} {food.name} = {food.quantity * food.calories} cal</p>
                <button onClick={() => { this.handleDelete(food.name) } } >Delete</button>
                </li>
              })
            }
          </ul>
          <p>Total {totalCalories} cal</p>
        </div>
      </div>
    )
  }
}


export default App