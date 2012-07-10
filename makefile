APP_NAME = awesometalker

SRC_DIR = js/src
BUILD_DIR = js/build
COMPILER_DIR = /cygdrive/d/Google\ Closure\ Compiler/compiler.jar

BASE_FILES = ${SRC_DIR}/intro.js\
	${SRC_DIR}/core.js\
	${SRC_DIR}/main.js\
	${SRC_DIR}/awesomeselector.js\
	${SRC_DIR}/awesomephrases.js\
	${SRC_DIR}/outro.js

${APP_NAME} = ${BUILD_DIR}/${APP_NAME}.js
MIN = ${BUILD_DIR}/${APP_NAME}.min.js
COMPILER = ${BUILD_DIR}/compiler.jar

${APP_NAME} : ${${APP_NAME}}
min : ${MIN}
gcomp : ${COMPILER}

${${APP_NAME}} : ${BASE_FILES}
	@@echo "Building Unminified Version"
	@@cat ${BASE_FILES} > ${BUILD_DIR}/${APP_NAME}.js

${COMPILER} : 
	@@echo "Copying Compiler"
	@@cp ${COMPILER_DIR} ${BUILD_DIR}/

${MIN} : ${BUILD_DIR}/${APP_NAME}.js ${COMPILER}
	@@echo "Building Minified Version"
	@@java -jar ${BUILD_DIR}/compiler.jar --js ${${APP_NAME}} --js_output_file ${MIN}

clean :
	@@echo "Removing Build Directory Contents:" ${BUILD_DIR}
	@@rm -f ${BUILD_DIR}/*.*
