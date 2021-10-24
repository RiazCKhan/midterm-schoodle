// Client facing scripts here

$(document).ready(function() {

  $("#copy").on("click", copy);
  $("#calendar-info").on("submit", getCalendarData);




})

const copy = function () {
  event.preventDefault()

  let $button = $("#copy")
  let $form = $button.closest("form")
  let text = $form.find("#url-link").val()

  navigator.clipboard.writeText(text)
}

const getCalendarData = function () {
  event.preventDefault()

console.log(myDatepickerOneOutput)


}
