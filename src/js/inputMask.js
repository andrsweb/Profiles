import Inputmask from "inputmask";

const selector = document.querySelectorAll( '.input-tel' )

const im = new Inputmask("99-9999999")
im.mask(selector)

Inputmask( { 'mask': '+7(999)-999-99-99' } ).mask(selector)
