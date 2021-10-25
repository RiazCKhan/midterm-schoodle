// Client facing scripts here

$(document).ready(function() {

  $("#copy").on("click", copy);

  $("#add-date-time-button").on("click", renderDates);



})

const copy = function () {
  event.preventDefault()
  let $button = $("#copy")
  let $form = $button.closest("form")
  let text = $form.find("#url-link").val()
  navigator.clipboard.writeText(text)
}

const renderDates = function () {
  event.preventDefault()

  const $form = $(this).closest("form")

  let startDateDay = $form.find("#date-form__start-day").val()
  let startDateMonth = $form.find("#date-form__start-month").val()
  let startDateYear = $form.find("#date-form__start-year").val()
  let startDateTime = $form.find("#date-form__start-time").val()

  let endDateDay = $form.find("#date-form__end-day").val()
  let endDateMonth = $form.find("#date-form__end-month").val()
  let endDateYear = $form.find("#date-form__end-year").val()
  let endDateTime = $form.find("#date-form__end-time").val()

  let pollOption = `<div>
  ${startDateTime} on ${startDateDay}/${startDateMonth}/${startDateYear} -
  ${endDateTime} on ${endDateDay}/${endDateMonth}/${endDateYear}</div>`

  $(".append-date-time").prepend(pollOption)

  // console.log('start', startDateDay, startDateMonth, startDateYear, startDateTime)
  // console.log('end', endDateDay, endDateMonth, endDateYear, endDateTime)
  $form.trigger("reset");
}
