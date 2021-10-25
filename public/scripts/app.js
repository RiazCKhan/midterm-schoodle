// Client facing scripts here

$(document).ready(function() {

  $("#copy").on("click", copy);




})

const copy = function () {
  event.preventDefault()

  let $button = $("#copy")
  let $form = $button.closest("form")
  let text = $form.find("#url-link").val()

  navigator.clipboard.writeText(text)
}
