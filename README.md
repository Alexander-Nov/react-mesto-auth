# Проект: Mesto Russia (React с аутентификацией)


### О проекте
Дальнейшее развитие проекта Mesto Russia, создан на основе React с добавленным функционалом регистрации и аутентификации (позволяет зарегистрироваться новому пользователю, выполнить вход в личный аккаунт для доступа к функционалу сервиса, выполонить выход из приложения).

Для незарегистрированного пользователя доступно только две страницы - регистрация и вход. После регистрации/аутентификации пользователь перенаправляется на главную страницу "/", на которую выводятся текущие изображения с сервера.

В мобильной версии приложения блок с выводом e-mail пользователя и кнопкой выхода из приложения заменено на "бургерное" меню, нажатие на которое открывает дополнительное меню с выводом скрытой ранее информации (e-mail + выход).

Проект демонстрирует функционал социальной платформы, отображающей имеющиеся на сервере фотографии студентов группы, при загрузке страницы осуществляется запрос данных текущего пользователя и полученные в ответе от сервера данные отображаются на странице (имя, описание и аватар пользователя).

Помимо функционала проект поддерживает функционал предыдущих версий, а именно: возможность редактирования профиля пользователя, замены картинки на аватаре пользователя, добавление новой карточки с названием и картинкой нового места. Так же пользователю доступно удаление любой из своих ранее загруженных фото, постановка/снятие лайка на любом фото. При удалении своей фотографии добавлено всплывающее окно с уточняющим вопросом, уверен ли пользователь в необходимости удаления выбранной фотографии.

Кроме того, улучшен пользовательский интерфейс за счет добавления функционала изменения надписи на кнопках форм в момент отправки запроса на сервер и получения ответа от него. Таким образом пользователь получает информацию о текущем процессе и не переживает, почему после нажатия кнопки какое-то время визуально "ничего не происходит".
