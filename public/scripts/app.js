// Client facing scripts here

$(document).ready(function () {
  $("#copy").on("click", copy);
  $("#add-date-time-button").on("click", renderDates);
  $("#user-form").on("submit", sendTimes);
  $("#vote-form").on("submit", getUserAndSendVote);

  $("#start-date-add-btn").on("click", renderStartDate)
  $("#end-date-add-btn").on("click", renderEndDate)
  $("#remove-start-date-btn").on("click", removeStartDate)
});

const renderStartDate = (event) => {
  event.preventDefault();

  let startDateFormData = document.getElementById("start-date-input").value
  let startDateFormDataArr = startDateFormData.split('')
  let startDay = startDateFormDataArr.slice(8, 10).join('');
  let startMonth = startDateFormDataArr.slice(5, 7).join('');
  let startYear = startDateFormDataArr.slice(0, 4).join('');
  let startTime = startDateFormDataArr.slice(11, 16).join('');

  let startOption = `<div class="col d-flex justify-content-center px-0 mt-2 mb-2 text-center"> ${startDay}-${startMonth}-${startYear}-${startTime} </div>
                     <div class="w-100 d-none d-md-block"></div>`;

  $("#start-time-container").append(startOption);


  // Error Handling
  // Trigger Form Reset
};

const renderEndDate = (event) => {
  event.preventDefault();

  let endDateFormData = document.getElementById("end-date-input").value
  let endDateFormDataArr = endDateFormData.split('')
  let endDay = endDateFormDataArr.slice(8, 10).join('');
  let endMonth = endDateFormDataArr.slice(5, 7).join('');
  let endYear = endDateFormDataArr.slice(0, 4).join('');
  let endTime = endDateFormDataArr.slice(11, 16).join('');

  let endOption = `<div class="col d-flex justify-content-center px-0 mt-2 mb-2 text-center"> ${endDay}-${endMonth}-${endYear}-${endTime} </div>
                   <div class="w-100 d-none d-md-block"></div>`;

  $("#end-time-container").append(endOption);


  // Error Handling
  // Trigger Form Reset
};

const removeStartDate = (event) => {
  event.preventDefault();
  $("#start-time-container.col div.col").last().remove()
  $("#start-time-container.col div.w-100").last().remove()
}

const copy = function (event) {
  event.preventDefault();
  let $button = $("#copy");
  let $form = $button.closest("form");
  let text = $form.find("#url-link").val();
  navigator.clipboard.writeText(text);
};

const renderDates = function (event) {
  event.preventDefault();

  const $form = $(this).closest("form");

  let startDateDay = $form.find("#date-form__start-day").val();
  let startDateMonth = $form.find("#date-form__start-month").val();
  let startDateYear = $form.find("#date-form__start-year").val();
  let startDateTime = $form.find("#date-form__start-time").val();

  let endDateDay = $form.find("#date-form__end-day").val();
  let endDateMonth = $form.find("#date-form__end-month").val();
  let endDateYear = $form.find("#date-form__end-year").val();
  let endDateTime = $form.find("#date-form__end-time").val();

  // let $error = $form.find(".error-msg")
  let $error = $("#date-form .error-msg");

  if (!startDateDay || !startDateMonth || !startDateYear || !startDateTime) {
    $error.text("Error: all fields required")
      .slideDown()
      .delay(1500)
      .slideUp();
    return false;
  }

  if (!endDateDay || !endDateMonth || !endDateYear || !endDateTime) {
    $error
      .text("Error: all fields required")
      .slideDown("slow")
      .delay(1500)
      .slideUp("slow");
    return false;
  }

  let pollOption = `
    <div class='time-container'>
    <span class="start-time"> ${startDateYear} / ${startDateMonth} / ${startDateDay} ${startDateTime} </span> -
    <span class="end-time"> ${endDateYear} / ${endDateMonth} / ${endDateDay} ${endDateTime} </span>
    </div>
  `;

  $("#append-date-time").prepend(pollOption);

  $form.trigger("reset");
};

const sendTimes = function (event) {
  event.preventDefault();
  let allDates = $("#append-date-time");

  let name = $("#user-form #name").val(); // DO NOT DELETE - Note: Find content by referencing 'double id / class'
  let email = $("#user-form #email").val();
  let title = $("#user-form #title").val();
  let description = $("#user-form #description").val();

  let data = {
    name,
    email,
    title,
    description,
    startDates: [],
    endDates: [],
  };

  allDates.children(".time-container").each(function () {
    let startTime = $(this).find(".start-time").text();
    let endTime = $(this).find(".end-time").text();

    data.startDates.push(startTime);
    data.endDates.push(endTime);
  });

  $.ajax({
    url: "/events/new",
    type: "POST",
    data: data,
    success: function (res) {
      window.location.href = res.url;
    },
    error: function () { },
    dataType: "json",
  });
};

const getUserAndSendVote = function (event) {
  event.preventDefault(); // remove this to see table poll update

  let voterName = $("#vote-form #voter-name").val();
  let voterEmail = $("#vote-form #voter-email").val();
  let optionOneVote = $("input[name=vote-poll-1]:checked", "#vote-form").val();
  let optionTwoVote = $("input[name=vote-poll-2]:checked", "#vote-form").val();
  let optionThreeVote = $(
    "input[name=vote-poll-3]:checked",
    "#vote-form"
  ).val();

  let entireUrl = $("#url-link").val();
  let splitUrl = entireUrl.split("/");
  let url = splitUrl[4];

  let data = {
    voterName,
    voterEmail,
    optionOneVote,
    optionTwoVote,
    optionThreeVote,
    url,
  };

  $.ajax({
    url: `/vote/${url}`,
    type: "POST",
    data: data,
    success: function (res) {
      location.reload();
      //window.location.href = res.url;
      /* update table values: jquery selector table id || invoke getVoteCount FN */
    },
    error: function () { },
    dataType: "json",
  });
};
