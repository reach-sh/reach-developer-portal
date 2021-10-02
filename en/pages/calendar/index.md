---
hasOtp: false
menuItem: mi-calendar
---

# Calendar

<div class="row justify-content-center">
  <div id="spinner" class="col-auto">
    <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
  </div>
  <div id="iframe" class="col-lg-10" style="display:none;">
    <div class="ratio ratio-16x9">
      <iframe 
        src="https://calendar.google.com/calendar/embed?src=c_e6q7eeck9lla4qnseln5ho1kpk%40group.calendar.google.com&ctz=America%2FNew_York&showTitle=0&showPrint=0&showCalendars=0" 
        style="border: 0" 
        frameborder="0" 
        scrolling="no"
        onload="document.getElementById('spinner').style.display='none';document.getElementById('iframe').style.display='block';">
      </iframe>
    </div>
  </div>
</div>
