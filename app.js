function viewCourses() {

    document.getElementById("output").innerHTML = `

        <h2>📘 My Courses</h2>

        <div style="display:grid;
                    grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
                    gap:20px;
                    margin-top:20px;">

            <div style="background:#f8fafc;
                        padding:15px;
                        border-radius:12px;
                        box-shadow:0 4px 10px rgba(0,0,0,0.1);">

                <h3>AWS Cloud Computing</h3>

                <iframe width="100%" height="200"
                    src="https://www.youtube.com/embed/ulprqHHWlng"
                    title="AWS Course"
                    frameborder="0"
                    allowfullscreen>
                </iframe>

            </div>

            <div style="background:#f8fafc;
                        padding:15px;
                        border-radius:12px;
                        box-shadow:0 4px 10px rgba(0,0,0,0.1);">

                <h3>DevOps Engineering</h3>

                <iframe width="100%" height="200"
                    src="https://www.youtube.com/embed/9pZ2xmsSDdo"
                    title="DevOps Course"
                    frameborder="0"
                    allowfullscreen>
                </iframe>

            </div>

            <div style="background:#f8fafc;
                        padding:15px;
                        border-radius:12px;
                        box-shadow:0 4px 10px rgba(0,0,0,0.1);">

                <h3>Linux Administration</h3>

                <iframe width="100%" height="200"
                    src="https://www.youtube.com/embed/sWbUDq4S6Y8"
                    title="Linux Course"
                    frameborder="0"
                    allowfullscreen>
                </iframe>

            </div>

            <div style="background:#f8fafc;
                        padding:15px;
                        border-radius:12px;
                        box-shadow:0 4px 10px rgba(0,0,0,0.1);">

                <h3>Python Programming</h3>

                <iframe width="100%" height="200"
                    src="https://www.youtube.com/embed/_uQrJ0TkZlc"
                    title="Python Course"
                    frameborder="0"
                    allowfullscreen>
                </iframe>

            </div>

        </div>

    `;
}