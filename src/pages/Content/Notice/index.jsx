import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Divider, message, Input } from 'antd';
// import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import React, { useState, useRef } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, addRule, removeRule } from './service';

// useState
// const [somestate, somesetState] = useState(init); 等价于this.setState({})
// somestate: 某个state(更新的最新值), somesetState: 改变state的函数, init: state的初始值
// somesetState的参数： 可以是一个用于改变somestate的式子

// useReducer useState的升级版本

// useEffect 默认情况下，effect 在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。传入第二个参数时，只有当 依赖值 改变后才会重新创建订阅，如果是空[]，只会执行一次。
// useEffect(函数，[所依赖的值])

// useRef
// 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

// import { Spin } from 'antd';
import styles from './index.less';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({
      desc: fields.desc,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const columns = [
    // 表格
    {
      title: '标题',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '标题为必填项',
        },
      ],
    },
    {
      title: '内容',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    // {
    //   title: '服务调用次数',
    //   dataIndex: 'callNo',
    //   sorter: true,
    //   hideInForm: true,
    //   renderText: (val) => `${val} 万`,
    // },
    {
      title: '范围',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '内部分享',
          // status: 'Default',
        },
        1: {
          text: '小程序',
          // status: 'Processing',
        },
        2: {
          text: 'App',
          // status: 'Success',
        },
        3: {
          text: '异常',
          // status: 'Error',
        },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: '创建人',
      dataIndex: 'creacter',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            配置
          </a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        className={styles.proTable}
        // headerTitle="查询c表格"
        actionRef={actionRef}
        rowKey="key"
        // search={false} // 搜索框
        options={false} // 工具栏 { fullScreen: true, reload:true, setting: true}
        toolBarRender={(action, { selectedRows }) => [
          // 自定义工具栏
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            发布消息
          </Button>,
          <Button
            danger
            disabled={selectedRows.length < 1}
            onClick={() => handleRemove(selectedRows)}
          >
            批量删除
          </Button>,
        ]}
        tableAlertRender={false}
        request={(params) => queryRule(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              handleModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;

// export default () => {
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 3000);
//   }, []);
//   return (
//     <PageHeaderWrapper content="这是一个新页面，从这里进行开发！" className={styles.main}>
//       <div
//         style={{
//           paddingTop: 100,
//           textAlign: 'center',
//         }}
//       >
//         <Spin spinning={loading} size="large" />
//       </div>
//     </PageHeaderWrapper>
//   );
// };
