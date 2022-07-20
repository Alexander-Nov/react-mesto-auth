import React from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import ConfirmDeletionPopup from "./ConfirmDeletionPopup.js";
import ImagePopup from "./ImagePopup.js";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/currentUserContext";
import AddPlacePopup from "./AddPlacePopup.js";
import { Route, Switch, useHistory } from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip.js";
import { register, signin, checkToken} from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isConfirmDeletionPopupOpen, setIsConfirmDeletionPopupOpen] =
    React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [willBeDeletedCard, setWillBeDeletedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id); // проверяем, есть ли уже лайк на этой карточке
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleConfirmedDeletion(card) {
    setIsLoading(true);
    api
      .deleteCard(card)
      .then(() => {
        setCards((state) => state.filter((c) => !(c._id === card._id)));
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardDelete(card) {
    setWillBeDeletedCard(card);
    setIsConfirmDeletionPopupOpen(true);
  }

  React.useEffect(() => {
    const jwt = localStorage.getItem('token');
    console.log(jwt);
    if (jwt) {
      checkToken(jwt)
      .then((res) => {
        setUserEmail(res.data.email);
        setLoggedIn(true);
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((resCardsList) => {
        setCards(resCardsList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    api
      .getUserData()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsConfirmDeletionPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setWillBeDeletedCard({});
    setSelectedCard({});
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  };

  const handleUpdateUser = (newUserData) => {
    setIsLoading(true);
    api
      .setUserInfo(newUserData)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateAvatar = (avatar) => {
    setIsLoading(true);
    api
      .updateAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddPlaceSubmit = (newCard) => {
    setIsLoading(true);
    api
      .postNewCard(newCard)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // функции регистрации, авторизации и выхода из приложения
  const history = useHistory();

  const handleSignUpSubmit = ({ email, password }) => {
    console.log("Отправляем запрос на сервер");
    register(password, email)
    .then ((res) => {
      console.log("Ура! Мы зарегистрировались!");
      setIsRegistered(true);
      setIsInfoTooltipOpen(true);
      history.push('/sign-in');
    })
    .catch((err) => console.log(err));
  };

  const handleSignInSubmit = ({ email, password }) => {
    console.log("Пробуем авторизоваться");
    signin(password, email)
    .then ((data) => {
      if (data) {
        checkToken(data.token)
        .then((res) => {
          setUserEmail(res.data.email);
          setLoggedIn(true);
          history.push('/');
        })
        .catch((err) => {
          console.log(err);
        });
      } else {
        setIsRegistered(false);
        setIsInfoTooltipOpen(true);
      }

    })
    .catch((err) => console.log(err));
  };

  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
    history.push('/sign-in');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
        email={userEmail}
        onSignOut={handleSignOut}/>

        <Switch>
          <Route path="/sign-in">
            <Login onEnterUser={handleSignInSubmit}/>
          </Route>

          <Route path="/sign-up">
            <Register onAddUser={handleSignUpSubmit}/>
          </Route>

          <ProtectedRoute
            exact path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}>
          </ProtectedRoute>
        </Switch>


        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ConfirmDeletionPopup
          isOpen={isConfirmDeletionPopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          card={willBeDeletedCard}
          onDeletionSubmit={handleConfirmedDeletion}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          isOpened={isImagePopupOpen}
        />

        <InfoTooltip
        isOpen={isInfoTooltipOpen}
        isRegistered={isRegistered}
        onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
