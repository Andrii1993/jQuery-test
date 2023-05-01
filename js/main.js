// загальна таблиця 
$(document).ready(function() {
  // Отримати дані з API
  $.ajax({
    url: 'https://randomuser.me/api/?results=20',
    dataType: 'json',
    beforeSend: function() {
      // Показати спінер-завантаження
      $('#table tbody tr').show();
    },
    success: function(data) {
      // Очистити таблицю та приховати спінер-завантаження
      $('#table tbody').empty();
      $('#table tbody tr').hide();

      // Заповнити таблицю даними
      $.each(data.results, function(i, user) {
        var tr = $('<tr>');

        // Додати аватар
        var avatar = $('<img>').attr('src', user.picture.thumbnail).addClass('avatar');
        var avatarTd = $('<td>').append(avatar);
        tr.append(avatarTd);

        // Додати ім'я та прізвище
        var name = user.name.first + ' ' + user.name.last;
        var nameTd = $('<td>').text(name);
        tr.append(nameTd);

        // Додати email
        var emailTd = $('<td>').text(user.email);
        tr.append(emailTd);

        // Додати телефон
        var phoneTd = $('<td>').text(user.phone);
        tr.append(phoneTd);

        // Додати кнопку "Детальніше"
        var detailsBtn = $('<button>').addClass('btn btn-primary').text('Детальніше');
        detailsBtn.click(function() {
          // Заповнити модальне вікно детальними даними
          $('#details-avatar').attr('src', user.picture.large);
          $('#details-fullname').text(name);
          $('#details-email').text(user.email);
          $('#details-phone').text(user.phone);

          // Показати модальне вікно
          $('#details-modal').modal('show');
        });
        var detailsTd = $('<td>').append(detailsBtn);
        tr.append(detailsTd);

        // Додати рядок до таблиці
        $('#table tbody').append(tr);
      });
    }
  });
});

//згенерувати користувача
$(document).ready(function () {
  // Відображення користувачів при завантаженні сторінки
  displayUsers();

  $("#generate-user-btn").on("click", function () {
    $(".modal").modal("show");
  });

  $("#generate-user").on("click", function () {
    var gender = $("#gender-select").val();
    var url = "https://randomuser.me/api/";
    if (gender !== "") {
      url += "?gender=" + gender;
    }
    $.ajax({
      url: url,
      dataType: "json",
      success: function (data) {
        var user = data.results[0];
        var fullName = user.name.first + " " + user.name.last;
        var email = user.email;
        var phone = user.phone;
        var avatarUrl = user.picture.thumbnail;
        // Створюємо рядок таблиці з даними про користувача
        var row = $("<tr></tr>");
        row.append($('<td><img class="avatar" src="' + avatarUrl + '"></td>'));
        row.append($("<td></td>").text(fullName));
        row.append($("<td></td>").text(email));
        row.append($("<td></td>").text(phone));
        // Додаємо кнопку "Детальніше"
        var detailsButton = $(
          '<button class="details-btn btn btn-primary">Детальніше</button>'
        );
        row.append($("<td></td>").append(detailsButton));
        // Додаємо рядок в таблицю
        $("#user-table tbody").prepend(row);
        // Збереження користувача в LocalStorage
        var users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({
          fullName: fullName,
          email: email,
          phone: phone,
          avatarUrl: avatarUrl,
        });
        localStorage.setItem("users", JSON.stringify(users));
        $(".modal").modal("hide");
        $("#user-table").show(); // показуємо таблицю

        // Обробник події на кнопку "Детальніше"
        detailsButton.on("click", function () {
          // Відображення детальної інформації про користувача у модальному вікні
          $("#details-modal .modal-body").empty(); // очистити вміст модального вікна
          var details = $("<div></div>");
          var avatar = $("<img class='avatar' src='" + avatarUrl + "'>");
          details.append(avatar);
          details.append($("<p></p>").text("Повне ім'я: " + fullName));
          details.append($("<p></p>").text("Email: " + email));
          details.append($("<p></p>").text("Телефон: " + phone));
          $("#details-modal .modal-body").append(details);
          $("#details-modal").modal("show");
        });
      },
      error: function () {
        console.log("Помилка при завантаженні даних");
      },
    });
  });

  function displayUsers() {
    var users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length > 0) {
      $("#user-table").show(); // показуємо таблицю
      // Додаємо рядки таблиці з користувачами
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var fullName = user.fullName;
        var email = user.email;
        var phone = user.phone;
        var avatarUrl = user.avatarUrl;
        // Створюємо рядок таблиці з даними про користувача
        var row = $("<tr></tr>");
        row.append($('<td><img class="avatar" src="' + avatarUrl + '"></td>'));
        row.append($("<td></td>").text(fullName));
        row.append($("<td></td>").text(email));
        row.append($("<td></td>").text(phone));
        // Додаємо кнопку "Детальніше"
        var detailsButton = $(
          '<button class="details-btn btn btn-primary">Детальніше</button>'
        );
        row.append($("<td></td>").append(detailsButton));
        // Додаємо рядок в таблицю
        $("#user-table tbody").append(row);
        // Обробник події на кнопку "Детальніше"
        detailsButton.on("click", function () {
          var details = $("<div></div>");
          var avatar = $("<img class='avatar' src='" + avatarUrl + "'>");
          details.append(avatar);
          details.append($("<p></p>").text("Повне ім'я: " + fullName));
          details.append($("<p></p>").text("Email: " + email));
          details.append($("<p></p>").text("Телефон: " + phone));
          $("#details-modal .modal-body").empty().append(details);
          $("#details-modal").modal("show");
          $('.modal-dialog').show();
        });
      }
    } else {
      $("#user-table").hide(); // ховаємо таблицю, якщо немає жодного користувача
    }
  }
});

//створити користувача
$(document).ready(function () {
  // Визначаємо подію натискання на кнопку "Створити користувача"
  $("#add-user-form").click(function (event) {
    // Зупиняємо діяльність за замовчуванням
    event.preventDefault();

    // зчитуємо значення полів форми
    let avatar = $("#avatar").val();
    let name = $("#name").val();
    let email = $("#email").val();
    let phone = $("#phone").val();

    // валідація поля електронної пошти
    let emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Будь ласка, введіть коректний email.");
      return;
    }

    // валідація поля номеру телефону
    let phoneRegex = /^\+?[0-9]{10,}$/;
    if (!phoneRegex.test(phone)) {
      alert("Будь ласка, введіть коректний номер телефону.");
      return;
    }

    // перевірка, чи всі поля заповнені
    if (!email || !phone) {
      alert("Будь ласка, заповніть всі поля форми.");
      return;
    }

    // створюємо новий рядок в таблиці
    let newRow = $("<tr>");

    // створюємо стовпець з аватаром
    let avatarCol = $("<td>");
    let avatarImg = $("<img>")
      .attr("src", avatar)
      .css({ width: "48px", height: "48px" });
    avatarCol.append(avatarImg);
    newRow.append(avatarCol);

    // створюємо стовпець з іменем та прізвищем
    let nameCol = $("<td>").text(name);
    newRow.append(nameCol);

    // створюємо стовпець з email
    let emailCol = $("<td>").text(email);
    newRow.append(emailCol);

    // створюємо стовпець з номером телефону
    let phoneCol = $("<td>").text(phone);
    newRow.append(phoneCol);

    // створюємо стовпець з кнопками
    let actionsCol = $("<td>");
    // let deleteButton = $("<button>")
    //   .addClass("btn btn-danger none")
    //   .text("Видалити");
    let detailsButton = $("<button>")
      .addClass("btn btn-primary details-button")
      .text("Детальніше");
    actionsCol.append(detailsButton);
    // actionsCol.append(deleteButton);
    newRow.append(actionsCol);

    // додаємо рядок до таблиці
    $("#user-table tbody").append(newRow);

    // Закриваємо модальне вікно
    $("#create-user-modal").modal("hide");
    $('#add-user-button').click(function() {
      // Показуємо модальне вікно
      $('#add-user-modal').modal('show');
    });
    // видаляємо рядок при натисканн
    // $(document).on("click", "#user-table tbody tr button", function () {
    //   $(this).closest("tr").remove();
    // });
    // обробник події для кнопки "Детальніше"
    $(document).on("click", ".details-button", function () {
      // зчитуємо значення полів
      let avatar = $(this).closest("tr").find("td:first-child img").attr("src");
      let name = $(this).closest("tr").find("td:nth-child(2)").text();
      let email = $(this).closest("tr").find("td:nth-child(3)").text();
      let phone = $(this).closest("tr").find("td:nth-child(4)").text();

      // заповнюємо поля модального вікна
      $("#details-avatar").attr("src", avatar);
      $("#details-fullname").text(name);
      $("#details-email").text(email);
      $("#details-phone").text(phone);

      // відкриваємо модальне вікно
      $("#details-modal").modal("show");
    });
  });
});

//створення користувача модальне вікно
$(document).ready(function () {
  const modal = $("#create-user-modal");
  const createUserBtn = $("#create-user-btn");
  const form = modal.find("form");

  createUserBtn.click(function () {
    modal.modal("show");
  });

  form.submit(function (event) {
    event.preventDefault();

    const avatar = form.find('input[name="avatar"]').val();
    const fullName = form.find('input[name="full-name"]').val();
    const email = form.find('input[name="email"]').val();
    const phone = form.find('input[name="phone"]').val();
    const gender = form.find('select[name="gender"]').val();
    const address = form.find('textarea[name="address"]').val();

    const user = {
      avatar: avatar,
      fullName: fullName,
      email: email,
      phone: phone,
      gender: gender,
      address: address,
    };

    console.log(user);

    modal.modal("hide");
    form[0].reset();
  });
});
//створення користувача модальне вікно
$(document).ready(function () {
  const modal = $("#create-user-modal");
  const createUserBtn = $("#create-user-btn");
  const form = modal.find("form");
  const userList = $("#user-list");

  createUserBtn.click(function () {
    modal.modal("show");
  });

  form.submit(function (event) {
    event.preventDefault();

    const avatar = form.find('input[name="avatar"]').val();
    const fullName = form.find('input[name="full-name"]').val();
    const email = form.find('input[name="email"]').val();
    const phone = form.find('input[name="phone"]').val();
    const gender = form.find('select[name="gender"]').val();
    const address = form.find('textarea[name="address"]').val();

    const user = {
      avatar: avatar,
      fullName: fullName,
      email: email,
      phone: phone,
      gender: gender,
      address: address,
    };

    console.log(user);

    // додавання нового користувача до таблиці
    userList.append(`<tr>
                        <td><img src="${user.avatar}" width="50px"></td>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${user.gender}</td>
                        <td>${user.address}</td>
                     </tr>`);

    modal.modal("hide");
    form[0].reset();
  });
});
