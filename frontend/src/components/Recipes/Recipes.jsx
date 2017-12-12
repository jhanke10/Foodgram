import React, { Component } from 'react';
import { Input, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

import styles from '../../styles/recipes.css';

export class Recipes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: "samhanke",
            recipes: [],
            visible: [],
            searchBy: ""
        };
        this.searchRecipes = this.searchRecipes.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        
        getRecipes()
            .then(function(response) {
                this.setState({recipes: response.data.data, visible: response.data.data});
                console.log(this.state.recipes);
            }.bind(this))
            .catch(function(error) {
                console.log(error);
        });
    }

    searchRecipes(event) {
        var recipes = [];
        for(var i = 0; i < this.state.recipes.length; i++) {
          if(this.state.searchBy === "title") {
              if(this.state.recipes[i].title.toLowerCase().includes(event.currentTarget.value) && event.currentTarget.value != '') {
                  recipes.push(this.state.recipes[i]);
              }
          } else {
              for(var j = 0; j < this.state.recipes[i].ingredients.length; j++) {
                if(this.state.recipes[i].ingredients[j].toLowerCase().includes(event.currentTarget.value) && event.currentTarget.value != '') {
                    recipes.push(this.state.recipes[i]);
                }
              }
          }
        }
        if(recipes.length == 0 && event.currentTarget.value == "") {
            this.setState({visible: this.state.recipes});
        } else {
            this.setState({visible: recipes});
        }
    }

    handleChange(e, { value }) {
        switch (value) {
          case "title":
            this.setState({searchBy: value});
            break;
          case "ingredients":
            this.setState({searchBy: value});
            break;
          default:

        }
    }

    render() {
        const sortOptions = [
            {
              text: 'Title',
              value: 'title'
            },
            {
              text: 'Ingredients',
              value: 'ingredients'
            }
        ];

        const recipes = this.state.visible.map((recipe, index) => {

            var recipeStyle = {
                  backgroundImage: 'url(' + recipe.imageUrl + ')'
            };
            return (
                <div key={index} className="Recipe" style={recipeStyle}>

                    <div className="RecipeText">
                        <h2>{recipe.title}</h2>
                    </div>
                </div>
            );
        });

        return(
            <div className="Recipes">
                <h1>Recipes</h1>
                <div className="Search">
                  <Input className='search_bar' type='text' placeholder='Search recipes...' onChange={this.searchRecipes} />
                  <p>Search By</p>
                  <Dropdown className='sort_menu' defaultValue={sortOptions[0].value} onChange={this.handleChange} search selection options={sortOptions} />
                </div>
                <div className="Found">
                  {recipes}
                </div>
            </div>
        );
    }
}

function getRecipes(){
    return axios({
        method: 'get',
        baseURL: 'http://localhost:4000/api/',
        url: 'recipes'
    });
}

export default Recipes
