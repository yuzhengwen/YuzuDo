import logo from './logo.svg';
import React from 'react';
import './App.css';

const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? process.env.REACT_APP_BASE_URL_LOCAL : process.env.REACT_APP_BASE_URL_PROD;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      activeItem: {
        id: null,
        title: '',
        completed: false,
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
  componentWillMount() {
    // sets up initial tasks list
    this.fetchTasks();
  }
  fetchTasks() {
    console.log('Fetching...');
    //fetch('http://localhost:8000/api/task-list/')
    fetch(`${baseURL}task-list/`)
      .then(response => response.json())
      .then(data => {
        console.log('Data:', data);
        this.setState({
          tasks: data
        });
        // re-render the component
      }
      )
  }
  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    console.log('Name:', name);
    console.log('Value:', value);
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value
      } // only update the title
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('ITEM:', this.state.activeItem);

    const csrftoken = this.getCookie('csrftoken');
    let url = `${baseURL}api/task-create/`;
    if (this.state.editing === true) {
      url = `${baseURL}task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false
      });
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      // refresh task list and clear activeItem
      this.fetchTasks();
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false,
        }
      });
    }).catch(function (error) {
      console.log('ERROR:', error);
    });
  }
  startEdit(task){
    this.setState({
      activeItem: task,
      editing: true,
    });
  }
  deleteTask(task){
    const csrftoken = this.getCookie('csrftoken');
    fetch(`${baseURL}task-delete/${task.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks();
    });
  }
  toggleCompletion(task){
    task.completed = !task.completed;
    const csrftoken = this.getCookie('csrftoken');
    let url = `${baseURL}task-update/${task.id}/`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(task)
    }).then(() => {
      this.fetchTasks();
    });
  }

  render() {
    let tasks = this.state.tasks;
    const self = this;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    className="form-control"
                    id="title"
                    type="text"
                    placeholder="Add task..."
                    name="title"
                    value={this.state.activeItem.title}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="submit"
                    className="btn btn-warning"
                    id="submit"
                    name="Add"
                  />
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map(function (task, index) {
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div style={{ flex: 7 }} onClick={()=>self.toggleCompletion(task)}>
                    {task.completed === false ? (<span>{task.title}</span>) :
                      (<strike>{task.title}</strike>)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={()=>self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={()=>self.deleteTask(task)} className="btn btn-sm btn-outline-dark">X</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
