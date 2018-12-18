#!/bin/bash

CUR_DIR=$(cd "$(dirname "$0")";pwd)
SRC_PROTO_PATH="$CUR_DIR"
SRC_PROTO_FILES=""
TMP_PROTO_PATH="$CUR_DIR/tmp_proto"
DST_DIR="$CUR_DIR/../assets/proto"
NODE_MODULES_PATH="$CUR_DIR/../node_modules"

PBJS_CMD=$NODE_MODULES_PATH/protobufjs/bin/pbjs
PBTS_CMD=$NODE_MODULES_PATH/protobufjs/bin/pbts

rm -fr $TMP_PROTO_PATH
mkdir -p $TMP_PROTO_PATH
rm -fr $DST_DIR/*.ts
mkdir -p $DST_DIR

function iterateDir(){
    for element in `ls $1`
    do
        dir_or_file=$1"/"$element
        if [ -d $dir_or_file ]
        then
            getdir $dir_or_file
        elif [[ "$dir_or_file" == *.proto ]];
		then
            cp $dir_or_file $TMP_PROTO_PATH/$element
			echo "$TMP_PROTO_PATH/$element"
			sed -i 's#star#pb#g' $TMP_PROTO_PATH/$element
			SRC_PROTO_FILES="$TMP_PROTO_PATH/$element $SRC_PROTO_FILES"
        fi
    done
}
iterateDir $SRC_PROTO_PATH

echo SRC_PROTO_FILES=$SRC_PROTO_FILES

CMD="$PBJS_CMD -t static-module -w es6 --es6 --no-verify --no-delimited -o $DST_DIR/Protos.js $SRC_PROTO_FILES"
echo "exec -> $CMD"
$CMD
CMD="$PBTS_CMD -o $DST_DIR/Protos.d.ts $DST_DIR/Protos.js"
echo "exec -> $CMD"
$CMD
